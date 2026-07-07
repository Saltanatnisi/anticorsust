"""
Строит реестр индикаторов ИАУ (Приложение 1 методики) на основе исходной
таблицы сопоставления с Рамочной статистической моделью UNODC.

Вход:  data/unodc_indicators_raw.csv (57 строк, пилары UNODC a/b/c)
Выход: data/indicators_registry.json  — обогащённый реестр с привязкой
       каждого индикатора к одному из 7 функциональных блоков ИАУ.

Правило сопоставления определено путём сверки количества и содержания
индикаторов в каждом аспекте UNODC (a.1, a.2, b.1, b.3, b.5, c.2) с
описанием блоков I-VII в главе 3 методики: суммарно 6+8+10+9+7+8+9 = 57,
что совпадает с общим числом индикаторов методики.
"""
import csv
import json

SRC = "data/unodc_indicators_raw.csv"
OUT = "data/indicators_registry.json"

# (номер_первого, номер_последнего, код_блока, вес_блока, название_блока)
BLOCK_RANGES = [
    (1, 6, "I", 0.25, "Распространенность коррупции"),
    (7, 14, "II", 0.20, "Эффективность уголовного преследования"),
    (15, 24, "III", 0.15, "Защита государственных финансов"),
    (25, 33, "IV", 0.15, "Система предупреждения коррупции"),
    (34, 40, "V", 0.10, "Управление конфликтом интересов"),
    (41, 48, "VI", 0.10, "Государственные закупки"),
    (49, 57, "VII", 0.05, "Открытость государства и общественный контроль"),
]


def block_for(idx: int):
    for lo, hi, code, weight, name in BLOCK_RANGES:
        if lo <= idx <= hi:
            return {"block_code": code, "block_weight": weight, "block_name": name}
    raise ValueError(f"No block mapping for index {idx}")


def to_bool(value: str):
    v = (value or "").strip().upper()
    if v in ("ИСТИНА", "TRUE", "1", "ДА"):
        return True
    if v in ("ЛОЖЬ", "FALSE", "0", "НЕТ", ""):
        return False
    return None


def main():
    with open(SRC, encoding="utf-8") as f:
        reader = csv.reader(f, delimiter=";")
        rows = list(reader)

    header = rows[0]
    records = []
    for r in rows[1:]:
        if not r or not r[0].strip():
            continue
        r = r + [""] * (len(header) - len(r))
        idx = int(r[0])
        indicator_raw = r[3].strip()
        code, _, name = indicator_raw.partition(" ")
        block = block_for(idx)
        record = {
            "id": idx,
            "unodc_component": r[1].strip(),
            "unodc_aspect": r[2].strip(),
            "indicator_code": code.strip(),
            "indicator_name": name.strip() or indicator_raw,
            "measurement_method": r[4].strip(),
            "category": r[5].strip(),
            "subcategory": r[6].strip(),
            "source_type": r[7].strip(),
            "calculation_method": r[8].strip(),
            "disaggregation": r[9].strip(),
            "available_in_kg": to_bool(r[10]),
            "data_source_institution": r[11].strip(),
            "responsible_institution": r[12].strip(),
            "contact_name": r[13].strip(),
            "contact_email": r[14].strip(),
            "contact_phone": r[15].strip(),
            "discrepancy_comment": r[16].strip(),
            "time_series_available": r[17].strip(),
            **block,
        }
        records.append(record)

    assert len(records) == 57, f"expected 57 indicators, got {len(records)}"

    by_block = {}
    for rec in records:
        by_block.setdefault(rec["block_code"], []).append(rec)

    summary = {
        code: {
            "block_name": items[0]["block_name"],
            "block_weight": items[0]["block_weight"],
            "indicator_count": len(items),
        }
        for code, items in sorted(by_block.items())
    }

    available_count = sum(1 for r in records if r["available_in_kg"])

    output = {
        "meta": {
            "total_indicators": len(records),
            "available_in_kg_count": available_count,
            "blocks_summary": summary,
        },
        "indicators": records,
    }

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"OK: {len(records)} indicators written to {OUT}")
    print(f"Available in KG (confirmed): {available_count} / {len(records)}")
    for code, s in summary.items():
        print(f"  Блок {code}: {s['block_name']} — {s['indicator_count']} индикаторов, вес {s['block_weight']}")


if __name__ == "__main__":
    main()
