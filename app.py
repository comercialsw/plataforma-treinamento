import streamlit as st
import json
from typing import List, Dict
from pathlib import Path
import pandas as pd

# ──────────────────────────────
# Arquivos locais
# ──────────────────────────────
CAMINHO_PROG   = Path("progresso.json")
CAMINHO_USERS  = Path("usuarios.json")
CAMINHO_VIDEOS = Path("videos.csv")      

# ──────────────────────────────
# Funções utilitárias
# ──────────────────────────────
def ler_progresso() -> Dict[str, List[str]]:
    if CAMINHO_PROG.exists():
        with open(CAMINHO_PROG, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

def salvar_progresso(dados: Dict[str, List[str]]):
    with open(CAMINHO_PROG, "w", encoding="utf-8") as f:
        json.dump(dados, f, indent=2, ensure_ascii=False)

def ler_usuarios() -> Dict[str, str]:
    if CAMINHO_USERS.exists():
        with open(CAMINHO_USERS, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

def salvar_usuarios(dados: Dict[str, str]):
    with open(CAMINHO_USERS, "w", encoding="utf-8") as f:
        json.dump(dados, f, indent=2, ensure_ascii=False)

def ler_videos() -> List[Dict[str, str]]:
    """
    Lê o CSV `videos.csv` e devolve uma lista de dicionários:
    [{id: str, titulo: str, categoria: str}, ...]
    """
    if not CAMINHO_VIDEOS.exists():
        st.error(f"Arquivo {CAMINHO_VIDEOS} não encontrado no repositório.")
        return []
    try:
        df = pd.read_csv(CAMINHO_VIDEOS, dtype=str).fillna("")
        colunas_esperadas = {"id", "titulo", "categoria"}
        if not colunas_esperadas.issubset(df.columns):
            st.error(f"CSV deve conter as colunas {sorted(colunas_esperadas)}.")
            return []
        return df.to_dict(orient="records")
    except Exception as e:
        st.error(f"Falha ao ler {CAMINHO_VIDEOS}: {e}")
        return []

# ──────────────────────────────
# Configuração da página
# ──────────────────────────────
st.set_page_config(page_title="SmartWay | Plataforma", page_icon="🛴", layout="wide")

# Garante que o usuário é sempre uma string (e-mail) ou None
if "user" not in st.session_state:
    st.session_state.user = None

# ──────────────────────────────
# Cabeçalho
# ──────────────────────────────
logo_col, title_col = st.columns([1, 3])
logo_col.image("logo-smartway.jpg", width=150)
title_col.markdown("## **Smartway – Plataforma de Vídeos**")

EMAIL_ADMIN = "comercial@smartwaybr.com.br"

# ──────────────────────────────
# BLOCO DE LOGIN / REGISTRO
# ──────────────────────────────
if st.session_state.user is None or not isinstance(st.session_state.user, str):
    aba = st.tabs(["Entrar", "Primeiro acesso"])
    usuarios = ler_usuarios()

    # Login
    with aba[0]:
        st.subheader("Login")
        email = st.text_input("E-mail", key="login_email")
        senha = st.text_input("Senha", type="password", key="login_pwd")
        if st.button("Entrar", key="btn_login"):
            if email in usuarios and usuarios[email] == senha:
                st.session_state.user = email.strip()
                st.rerun()
            else:
                st.error("Usuário ou senha inválidos.")

    # Cadastro
    with aba[1]:
        st.subheader("Cadastro de novo usuário")
        email_r = st.text_input("E-mail", key="reg_email")
        pwd_r1 = st.text_input("Senha", type="password", key="reg_pwd1")
        pwd_r2 = st.text_input("Confirme a senha", type="password", key="reg_pwd2")
        if st.button("Registrar", key="btn_reg"):
            if pwd_r1 != pwd_r2:
                st.error("As senhas não coincidem.")
            elif email_r in usuarios:
                st.error("E-mail já cadastrado.")
            else:
                usuarios[email_r.strip()] = pwd_r1
                salvar_usuarios(usuarios)
                st.session_state.user = email_r.strip()
                st.success("Cadastro realizado! Redirecionando…")
                st.rerun()

# ──────────────────────────────
# ÁREA LOGADA
# ──────────────────────────────
else:
    usuario = st.session_state.user.strip()

    # Sidebar
    with st.sidebar:
        st.markdown(f"### 👤 {usuario}")
        if st.button("Sair"):
            st.session_state.user = None
            st.rerun()

    # Painel de administração (apenas para o admin)
    if usuario == EMAIL_ADMIN:
        st.markdown("---")
        st.markdown("## Painel de Administração")

        with st.expander("👥 Ver usuários cadastrados"):
            usuarios_df = pd.DataFrame(
                list(ler_usuarios().items()), columns=["E-mail", "Senha"]
            )
            st.table(usuarios_df)

        with st.expander("📈 Ver progresso de todos os usuários"):
            progresso_dict = ler_progresso()
            progresso_df = pd.DataFrame(
                [
                    {"Usuário": u, "Vídeos assistidos": ", ".join(vids)}
                    for u, vids in progresso_dict.items()
                ]
            )
            st.table(progresso_df)

    # ──────────────────────────
    # Dashboard principal
    # ──────────────────────────
    dados_progresso = ler_progresso()
    assistidos = dados_progresso.get(usuario, [])

    # Carrega vídeos do CSV
    videos = ler_videos()

    if not videos:
        st.stop()  # interrompe a execução se não houver vídeos

    categorias = sorted({v["categoria"] for v in videos if v["categoria"]})
    cat_sel = st.selectbox("Categoria", ["Todas"] + categorias)

    # Define subcategorias apenas se a categoria for 'Apresentação Modelos'
    subcat_sel = None
    if cat_sel == "Apresentação Modelos":
        subcategorias = sorted({v.get("subcategoria", "") for v in videos if v["categoria"] == cat_sel and v.get("subcategoria")})
        subcat_sel = st.selectbox("Subcategoria", ["Todas", "Veículo 2 Rodas", "Triciclos"])


    if cat_sel == "Apresentação Modelos" and subcat_sel and subcat_sel != "Todas":
    lista = [
        v for v in videos
        if v["categoria"] == cat_sel and v.get("subcategoria", "") == subcat_sel
    ]
else:
    lista = [
        v for v in videos
        if cat_sel == "Todas" or v["categoria"] == cat_sel
    ]


    for v in lista:
        col1, col2 = st.columns([3, 1])
        with col1:
            st.markdown(f"### {v['titulo']}")
            st.video(f"https://www.youtube.com/watch?v={v['id']}")
        with col2:
            ja = v["id"] in assistidos
            if ja:
                st.success("✔ Já assistido")
            else:
                if st.button("Marcar como assistido", key=f"marcar_{v['id']}"):
                    try:
                        if v["id"] not in assistidos:
                            assistidos.append(v["id"])
                            dados_progresso[usuario] = assistidos
                            salvar_progresso(dados_progresso)
                        st.success("Marcado!")
                        st.rerun()
                    except Exception as e:
                        st.error(f"Falha ao salvar: {e}")
