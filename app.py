import streamlit as st
import json
from typing import List, Dict
from pathlib import Path

# Arquivos locais
CAMINHO_PROG = Path("progresso.json")
CAMINHO_USERS = Path("usuarios.json")

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

# Lista fixa de vídeos
videos: List[Dict[str, str]] = [
    {"id": "4dkCJjV0d6Y", "titulo": "Segurança", "categoria": "Apresentação Modelos"},
    {"id": "IbthtipprPs", "titulo": "Dicas", "categoria": "Dicas Smartway"},
]

st.set_page_config(page_title="SmartWay | Plataforma", page_icon="🛴", layout="wide")

# Garante que o usuário é sempre uma string (e-mail) ou None
if "user" not in st.session_state:
    st.session_state.user = None

logo_col, title_col = st.columns([1, 3])
logo_col.image("logo-smartway.jpg", width=150)
title_col.markdown("## **SmartWay – Plataforma de Vídeos**")

# LOGIN / REGISTRO LOCAL
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
                st.session_state.user = email.strip()  # sempre string
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
                st.session_state.user = email_r.strip()  # sempre string
                st.success("Cadastro realizado! Redirecionando…")
                st.rerun()

# DASHBOARD LOCAL

EMAIL_ADMIN = "comercial@smartwaybr.com.br"

elif isinstance(st.session_state.user, str):
    usuario = st.session_state.user.strip()

    with st.sidebar:
        st.markdown(f"### 👤 {usuario}")
        if st.button("Sair"):
            st.session_state.user = None
            st.rerun()

        # PAINEL DE ADMINISTRAÇÃO (visível só para o admin)
        if usuario == EMAIL_ADMIN:
            st.markdown("---")
            st.markdown("## Painel de Administração")
            if st.button("Ver usuários cadastrados"):
                st.json(ler_usuarios())
            if st.button("Ver progresso de todos os usuários"):
                st.json(ler_progresso())

elif isinstance(st.session_state.user, str):
    usuario = st.session_state.user.strip()  # sempre string, sem espaços

    # Barra lateral – Logout
    with st.sidebar:
        st.markdown(f"### 👤 {usuario}")
        if st.button("Sair"):
            st.session_state.user = None
            st.rerun()

    dados = ler_progresso()
    assistidos = dados.get(usuario, [])

    categorias = sorted({v["categoria"] for v in videos})
    cat_sel = st.selectbox("Categoria", ["Todas"] + categorias)

    lista = [v for v in videos if cat_sel == "Todas" or v["categoria"] == cat_sel]

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
                            dados[usuario] = assistidos
                            salvar_progresso(dados)
                        st.success("Marcado!")
                        st.rerun()
                    except Exception as e:
                        st.error(f"Falha ao salvar: {e}")
