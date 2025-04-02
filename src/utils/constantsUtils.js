export const ConstantsUtils = {
    NullFieldMask: '-',
    NotANumber: 'NaN',

    CountriesList: [
        { label: "Brasil", value: "BR", ddi: "+55", maskZipCode: "99999-999", maskPhone: "+99 (99) 99999-9999" },
        { label: "Argentina", value: "AR", ddi: "+54", maskZipCode: "a9999aaa", maskPhone: "+99 (999) 999-9999" },
        { label: "Bolívia", value: "BO", ddi: "+591", maskZipCode: "9999", maskPhone: "+999 9-999-9999" },
        { label: "Paraguai", value: "PY", ddi: "+595", maskZipCode: "9999", maskPhone: "+999 (999) 999-999" }
    ],

    StatesList: [
        { value: 'AC', label: 'Acre' },
        { value: 'AL', label: 'Alagoas' },
        { value: 'AP', label: 'Amapá' },
        { value: 'AM', label: 'Amazonas' },
        { value: 'BA', label: 'Bahia' },
        { value: 'CE', label: 'Ceará' },
        { value: 'DF', label: 'Distrito Federal' },
        { value: 'ES', label: 'Espírito Santo' },
        { value: 'GO', label: 'Goiás' },
        { value: 'MA', label: 'Maranhão' },
        { value: 'MT', label: 'Mato Grosso' },
        { value: 'MS', label: 'Mato Grosso do Sul' },
        { value: 'MG', label: 'Minas Gerais' },
        { value: 'PA', label: 'Pará' },
        { value: 'PB', label: 'Paraíba' },
        { value: 'PR', label: 'Paraná' },
        { value: 'PE', label: 'Pernambuco' },
        { value: 'PI', label: 'Piauí' },
        { value: 'RJ', label: 'Rio de Janeiro' },
        { value: 'RN', label: 'Rio Grande do Norte' },
        { value: 'RS', label: 'Rio Grande do Sul' },
        { value: 'RO', label: 'Rondônia' },
        { value: 'RR', label: 'Roraima' },
        { value: 'SC', label: 'Santa Catarina' },
        { value: 'SP', label: 'São Paulo' },
        { value: 'SE', label: 'Sergipe' },
        { value: 'TO', label: 'Tocantins' }
    ],

    RowsPerPage: 10,

    MapInvoiceStatus: [
        { value: 'pending', label: 'Pendente' },
        { value: 'paid', label: 'Pago' },
        { value: 'canceled', label: 'Cancelado' },
        { value: 'partially_paid', label: 'Pago parcialmente' },
        { value: 'externally_paid', label: 'Pago externamente' },
        { value: 'refunded', label: 'Estornado' },
        { value: 'expired', label: 'Expirado' },
        { value: 'authorized', label: 'Autorizado' },
        { value: 'draft', label: 'Rascunho' },
    ],

    MapCoupon: [
        { value: 'name', label: 'código' },
        { value: 'discount', label: 'desconto' },
        { value: 'created_at', label: 'data de aplicação' },
        { value: 'recurrent', label: 'recorrente' },
    ],

    EvapoGradient: [
        { "value": 0, "color": "#00FF00", "red": 0, "green": 255, "blue": 0, "valueRGB": 0, "alpha": 1 },
        { "value": 0.5, "color": "#32FF00", "red": 50, "green": 255, "blue": 0, "valueRGB": 127.5, "alpha": 1 },
        { "value": 1, "color": "#64FF00", "red": 100, "green": 255, "blue": 0, "valueRGB": 255, "alpha": 1 },
        { "value": 1.5, "color": "#96FF00", "red": 150, "green": 255, "blue": 0, "valueRGB": 382.5, "alpha": 1 },
        { "value": 2, "color": "#C8FF00", "red": 200, "green": 255, "blue": 0, "valueRGB": 510, "alpha": 1 },
        { "value": 3, "color": "#FFFF00", "red": 255, "green": 255, "blue": 0, "valueRGB": 765, "alpha": 1 },
        { "value": 5, "color": "#FFC800", "red": 255, "green": 200, "blue": 0, "valueRGB": 1275, "alpha": 1 },
        { "value": 6, "color": "#FF9600", "red": 255, "green": 150, "blue": 0, "valueRGB": 1530, "alpha": 1 },
        { "value": 7, "color": "#FF6400", "red": 255, "green": 100, "blue": 0, "valueRGB": 1785, "alpha": 1 },
        { "value": 9, "color": "#FF3200", "red": 255, "green": 50, "blue": 0, "valueRGB": 2295, "alpha": 1 },
        { "value": 10, "color": "#FF0000", "red": 255, "green": 0, "blue": 0, "valueRGB": 2550, "alpha": 1 }
    ],

    ColorsCrop: ['#db5d27', '#278a17', '#e6e225', '#2e25e6', '#633d27', '#c72cdb', '#bf1324', '#000000', '#34eb37', '#33b9de']
}