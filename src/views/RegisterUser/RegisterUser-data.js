export const FORM_RULES = {
    txtUser: {
        required: { value: true, message: 'Valor requerido' },
        minLength: { value: 4, message: 'Mínimo 4 caracteres' },
        maxLength: { value: 20, message: 'Mínimo 20 caracteres' }
    },
    txtPassword: {
        required: { value: true, message: 'Valor requerido' },
        minLength: { value: 6, message: 'Mínimo 6 caracteres' }
    },
    txtProfile: {
        required: { value: true, message: 'Valor requerido' },
    },
    txtState: {
        required: { value: true, message: 'Valor requerido' },
    },
};