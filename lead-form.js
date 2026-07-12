const leadForm = document.querySelector("#leadForm");
const whatsappInput = document.querySelector("#whatsapp");
const rendaInput = document.querySelector("#renda");
const formStatus = document.querySelector("#formStatus");

// Edite somente este numero para trocar o WhatsApp de destino.
const WHATSAPP_NUMBER = "5541988097432";

function onlyNumbers(value) {
  return value.replace(/\D/g, "");
}

function formatCurrency(value) {
  const digits = onlyNumbers(value);

  if (!digits) {
    return "";
  }

  const amount = Number(digits) / 100;

  return amount.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatWhatsapp(value) {
  const digits = onlyNumbers(value).slice(0, 11);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function getFieldValue(formData, fieldName) {
  return formData.get(fieldName) || "Não informado";
}

function buildLeadMessage() {
  const formData = new FormData(leadForm);

  const nome = getFieldValue(formData, "nome");
  const whatsapp = getFieldValue(formData, "whatsapp");
  const cidade = getFieldValue(formData, "cidade");
  const aquisicao = getFieldValue(formData, "aquisicao");
  const trabalho = getFieldValue(formData, "trabalho");
  const carteira = getFieldValue(formData, "carteira");
  const renda = getFieldValue(formData, "renda");
  const fgts = getFieldValue(formData, "fgts");
  const filhos = getFieldValue(formData, "filhos");
  const financiamento = getFieldValue(formData, "financiamento");
  const restricao = getFieldValue(formData, "restricao");

  return [
    "Olá, Yuki!",
    "",
    "Preenchi a pré-análise de crédito pelo Minha Casa Minha Vida.",
    "",
    `Nome: ${nome}`,
    `WhatsApp: ${whatsapp}`,
    `Cidade ou região: ${cidade}`,
    `Pretende adquirir: ${aquisicao}`,
    `Tipo de trabalho: ${trabalho}`,
    `Mais de 3 anos de carteira assinada: ${carteira}`,
    `Renda bruta mensal: ${renda}`,
    `Possui FGTS: ${fgts}`,
    `Possui filhos menores de idade: ${filhos}`,
    `Possui financiamento ativo: ${financiamento}`,
    `Possui restrição no CPF: ${restricao}`,
    "",
    "Gostaria de saber qual o valor aproximado de financiamento disponível para o meu perfil e quais seriam os próximos passos.",
  ].join("\n");
}

function setStatus(message, isError = false) {
  formStatus.textContent = message;
  formStatus.classList.toggle("error", isError);
}

function validateForm() {
  if (leadForm.checkValidity()) {
    return true;
  }

  setStatus("Preencha todos os campos obrigatórios antes de continuar.", true);
  leadForm.reportValidity();
  return false;
}

whatsappInput.addEventListener("input", (event) => {
  event.target.value = formatWhatsapp(event.target.value);
});

rendaInput.addEventListener("input", (event) => {
  event.target.value = formatCurrency(event.target.value);
});

leadForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  const message = encodeURIComponent(buildLeadMessage());
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

  setStatus("Mensagem pronta. Abrindo o WhatsApp...");
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
});
