import streamlit as st
import requests
import uuid

BACKEND_URL = "http://localhost:3000"

st.set_page_config(page_title="PDF RAG Assistant", page_icon="📄", layout="wide")

st.title("📄 PDF RAG Assistant")
st.write("Upload a PDF, select a document, and ask questions with follow-up support.")

if "session_id" not in st.session_state:
    st.session_state.session_id = str(uuid.uuid4())

if "documents" not in st.session_state:
    st.session_state.documents = []

if "selected_document_id" not in st.session_state:
    st.session_state.selected_document_id = None

if "chat_messages" not in st.session_state:
    st.session_state.chat_messages = []

def fetch_documents():
    try:
        response = requests.get(f"{BACKEND_URL}/api/documents")
        if response.status_code == 200:
            st.session_state.documents = response.json().get("data", [])
        else:
            st.error(f"Failed to fetch documents: {response.text}")
    except Exception as e:
        st.error(f"Error fetching documents: {e}")

st.subheader("1. Upload PDF")

uploaded_file = st.file_uploader("Choose a PDF file", type=["pdf"])

if uploaded_file is not None:
    if st.button("Upload PDF"):
        files = {
            "pdf": (uploaded_file.name, uploaded_file.getvalue(), "application/pdf")
        }

        try:
            with st.spinner("Uploading and processing PDF..."):
                response = requests.post(
                    f"{BACKEND_URL}/api/v1/upload/pdf",
                    files=files
                )

            if response.status_code == 200:
                
                data = response.json()["data"]
                st.success("PDF uploaded successfully!")
                st.write(f"**File:** {data.get('originalName')}")
                st.write(f"**Document ID:** {data.get('documentId')}")
                st.write(f"**Chunks:** {data.get('totalChunks')}")
                fetch_documents()
                st.session_state.selected_document_id = data.get("documentId")
            else:
                st.error(f"Upload failed: {response.text}")
        except Exception as e:
            st.error(f"Error while uploading PDF: {e}")

st.subheader("2. Select Document")

if st.button("Refresh Documents"):
    fetch_documents()

if not st.session_state.documents:
    fetch_documents()

document_options = {
    f"{doc['id']} - {doc['original_name']}": doc["id"]
    for doc in st.session_state.documents
}

if document_options:
    selected_label = st.selectbox(
        "Choose a document",
        options=list(document_options.keys())
    )
    st.session_state.selected_document_id = document_options[selected_label]
else:
    st.info("No documents available yet. Upload a PDF first.")

st.subheader("3. Ask Questions")

question = st.text_input("Enter your question")

col1, col2 = st.columns([1, 1])

with col1:
    ask_clicked = st.button("Ask Question")

with col2:
    if st.button("New Chat Session"):
        st.session_state.session_id = str(uuid.uuid4())
        st.session_state.chat_messages = []
        st.success("Started a new session")

if ask_clicked:
    if not st.session_state.selected_document_id:
        st.warning("Please select a document first.")
    elif not question.strip():
        st.warning("Please enter a question.")
    else:
        payload = {
            "documentId": st.session_state.selected_document_id,
            "sessionId": st.session_state.session_id,
            "question": question
        }

        try:
            with st.spinner("Generating answer..."):
                response = requests.post(
                    f"{BACKEND_URL}/api/chat/ask",
                    json=payload,
                    headers={"Content-Type": "application/json"}
                )

            if response.status_code == 200:
                result = response.json()["data"]

                st.session_state.chat_messages.append({
                    "question": question,
                    "answer": result.get("answer"),
                    "sources": result.get("sources", []),
                    "documentName": result.get("documentName")
                })
            else:
                st.error(f"Question failed: {response.text}")
        except Exception as e:
            st.error(f"Error while asking question: {e}")

st.subheader("4. Chat")

if st.session_state.chat_messages:
    for index, msg in enumerate(st.session_state.chat_messages, start=1):
        with st.container():
            st.markdown(f"### Question {index}")
            st.write(msg["question"])

            st.markdown(f"### Answer {index}")
            st.success(msg["answer"])

            if msg.get("documentName"):
                st.caption(f"Document: {msg['documentName']}")

            if msg.get("sources"):
                with st.expander(f"Sources for Answer {index}"):
                    for s_index, source in enumerate(msg["sources"], start=1):
                        st.markdown(f"**Source {s_index}**")
                        st.write(f"Document ID: {source.get('document_id')}")
                        st.write(f"Chunk Index: {source.get('chunk_index')}")
                        st.write(f"Similarity: {round(source.get('similarity', 0), 4)}")
                        st.write(source.get("content", ""))
                        st.markdown("---")
else:
    st.info("No chat yet. Ask your first question.")

st.subheader("5. Session Info")
st.code(st.session_state.session_id)