from pathlib import Path
import base64
import re

import streamlit as st

ROOT = Path(__file__).resolve().parent

st.set_page_config(
    page_title="Manan Patel",
    page_icon=str(ROOT / "favicon.svg"),
    layout="wide",
    initial_sidebar_state="collapsed",
)

st.markdown(
    """
    <style>
      header, footer, #MainMenu, [data-testid="stToolbar"], [data-testid="stHeader"],
      [data-testid="stDecoration"], [data-testid="stStatusWidget"] {
        display: none !important;
      }
      .stApp, .stAppViewContainer, [data-testid="stAppViewContainer"] {
        background: #f4f6f8;
      }
      .block-container, [data-testid="stMainBlockContainer"] {
        padding: 0 !important;
        max-width: 100% !important;
      }
      [data-testid="stMain"] {
        height: 100vh !important;
        overflow: hidden !important;
        padding: 0 !important;
      }
      [data-testid="stMainBlockContainer"],
      [data-testid="stVerticalBlock"] {
        height: 100% !important;
        min-height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        gap: 0 !important;
      }
      [data-testid="stElementContainer"]:not(:has(iframe)) {
        display: none !important;
        height: 0 !important;
        min-height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      [data-testid="stElementContainer"]:has(iframe),
      iframe[data-testid="stIFrame"] {
        height: 100vh !important;
        min-height: 100vh !important;
        max-height: 100vh !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      iframe[data-testid="stIFrame"] {
        width: 100% !important;
        border: 0 !important;
        display: block !important;
      }
    </style>
    """,
    unsafe_allow_html=True,
)


def portfolio_html() -> str:
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    css = (ROOT / "styles.css").read_text(encoding="utf-8")
    script = (ROOT / "script.js").read_text(encoding="utf-8")
    orbit = (ROOT / "orbit.js").read_text(encoding="utf-8")
    portrait = base64.b64encode((ROOT / "portrait.png").read_bytes()).decode("ascii")

    html = html.replace(
        'src="portrait.png"',
        f'src="data:image/png;base64,{portrait}"',
    )
    html = re.sub(
        r'<link rel="stylesheet" href="styles\.css[^"]*"\s*/>',
        f"<style>\n{css}\n</style>",
        html,
        count=1,
    )
    html = html.replace(
        '<script src="script.js"></script>',
        f"<script>\n{script}\n</script>",
    )
    html = re.sub(
        r'<script src="orbit\.js[^"]*"></script>',
        f"<script>\n{orbit}\n</script>",
        html,
        count=1,
    )
    return html


st.iframe(portfolio_html(), height="stretch")
