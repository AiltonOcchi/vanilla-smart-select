/**
 * Validation Helpers (Optional)
 * Utilities para facilitar validação customizada de formulários
 */

/**
 * Valida um formulário com VanillaSmartSelect
 * @param {HTMLFormElement|string} form - Formulário ou seletor
 * @param {Object} options - Opções de validação
 * @returns {boolean} True se válido
 */
export function validateForm(form, options = {}) {
  const formElement =
    typeof form === "string" ? document.querySelector(form) : form;

  if (!formElement) {
    console.error("Form not found:", form);
    return false;
  }

  const {
    onValid = null,
    onInvalid = null,
    showNativeMessage = true,
  } = options;

  // Usa validação HTML5 nativa
  const isValid = formElement.checkValidity();

  if (isValid) {
    if (typeof onValid === "function") {
      onValid(formElement);
    }
  } else {
    if (typeof onInvalid === "function") {
      onInvalid(formElement);
    }

    // Mostra mensagem nativa do navegador
    if (showNativeMessage) {
      formElement.reportValidity();
    }
  }

  return isValid;
}

/**
 * Adiciona validação customizada em tempo real para todos os selects de um formulário
 * @param {HTMLFormElement|string} form - Formulário ou seletor
 * @param {Function} validator - Função validadora customizada (element) => boolean|string
 */
export function addCustomValidation(form, validator) {
  const formElement =
    typeof form === "string" ? document.querySelector(form) : form;

  if (!formElement) {
    console.error("Form not found:", form);
    return;
  }

  const selects = formElement.querySelectorAll("select");

  selects.forEach((select) => {
    select.addEventListener("vs:change", () => {
      const result = validator(select);

      if (result === true || result === "") {
        // Válido
        select.setCustomValidity("");
      } else if (typeof result === "string") {
        // Inválido com mensagem customizada
        select.setCustomValidity(result);
      } else {
        // Inválido sem mensagem (usa mensagem padrão)
        select.setCustomValidity("Campo inválido");
      }
    });
  });
}

/**
 * Helper simples para validar formulário no submit
 * @param {HTMLFormElement|string} form - Formulário ou seletor
 * @param {Function} onSuccess - Callback quando válido
 */
export function onValidSubmit(form, onSuccess) {
  const formElement =
    typeof form === "string" ? document.querySelector(form) : form;

  if (!formElement) {
    console.error("Form not found:", form);
    return;
  }

  formElement.addEventListener("submit", (e) => {
    e.preventDefault();

    if (formElement.checkValidity()) {
      onSuccess(e, formElement);
    } else {
      formElement.reportValidity();
    }
  });
}

export default {
  validateForm,
  addCustomValidation,
  onValidSubmit,
};
