"""Subset HarmonyOS Sans SC for this site.

Keeps ASCII, CJK punctuation, project source text, and GB2312 level-1/2
common characters. Missing glyphs fall back via CSS font stack.
"""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FONT_SRC = ROOT / "assets" / "font" / "HarmonyOS_Sans_SC_Medium.woff2"
FONT_OUT = ROOT / "assets" / "font" / "HarmonyOS_Sans_SC_Medium.subset.woff2"
CHARS_OUT = ROOT / "assets" / "font" / "_subset_chars.txt"


def collect_project_chars() -> set[str]:
    chars: set[str] = set()
    patterns = ("**/*.vue", "**/*.ts", "**/*.json", "**/*.md", "**/*.css", "**/*.html")
    skip = {"node_modules", ".git", ".output", ".nuxt", "dist", "scripts"}
    for pat in patterns:
        for path in ROOT.glob(pat):
            if any(part in skip for part in path.parts):
                continue
            try:
                text = path.read_text(encoding="utf-8", errors="ignore")
            except OSError:
                continue
            chars.update(text)
    return chars


def gbk_common_chars() -> set[str]:
    """Approximate common simplified Chinese via GBK double-byte ranges."""
    chars: set[str] = set()
    for hi in range(0xB0, 0xF8):
        for lo in range(0xA1, 0xFF):
            try:
                ch = bytes((hi, lo)).decode("gbk")
            except UnicodeDecodeError:
                continue
            if len(ch) == 1:
                chars.add(ch)
    return chars


def base_chars() -> set[str]:
    chars: set[str] = set()
    for code in range(0x20, 0x7F):
        chars.add(chr(code))
    # General punctuation + CJK symbols/punct + hiragana/katakana
    for start, end in (
        (0x00A0, 0x00FF),
        (0x2000, 0x206F),
        (0x3000, 0x303F),
        (0x3040, 0x30FF),
        (0xFF00, 0xFFEF),
        (0xAC00, 0xD7A3),  # Hangul for ko locale chrome
    ):
        for code in range(start, end + 1):
            chars.add(chr(code))
    return chars


def filter_chars(chars: set[str]) -> str:
    kept: list[str] = []
    for ch in chars:
        o = ord(ch)
        if o < 0x20 or ch.isspace():
            continue
        if (
            o <= 0x024F
            or 0x2000 <= o <= 0x206F
            or 0x3000 <= o <= 0x30FF
            or 0x3400 <= o <= 0x4DBF
            or 0x4E00 <= o <= 0x9FFF
            or 0xAC00 <= o <= 0xD7AF
            or 0xFF00 <= o <= 0xFFEF
        ):
            kept.append(ch)
    return "".join(sorted(set(kept), key=ord))


def main() -> None:
    if not FONT_SRC.exists():
        raise SystemExit(f"missing font: {FONT_SRC}")

    text = filter_chars(collect_project_chars() | gbk_common_chars() | base_chars())
    CHARS_OUT.write_text(text, encoding="utf-8")
    print(f"unique chars: {len(text)}")

    # Lazy import so script still documents intent without deps on dry runs
    from fontTools.subset import main as subset_main

    args = [
        str(FONT_SRC),
        f"--text-file={CHARS_OUT}",
        "--flavor=woff2",
        f"--output-file={FONT_OUT}",
        "--layout-features=*",
        "--glyph-names",
        "--symbol-cmap",
        "--legacy-cmap",
        "--notdef-glyph",
        "--notdef-outline",
        "--recommended-glyphs",
        "--name-legacy",
        "--drop-tables+=FFTM",
    ]
    subset_main(args)
    src_kb = FONT_SRC.stat().st_size / 1024
    out_kb = FONT_OUT.stat().st_size / 1024
    print(f"source: {src_kb:.1f} KB")
    print(f"subset: {out_kb:.1f} KB ({out_kb / src_kb * 100:.1f}%)")


if __name__ == "__main__":
    main()
