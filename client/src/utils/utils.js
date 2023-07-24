export function priceFormatter(value) {
    const formatter = new Intl.NumberFormat('hu-HU', {
        style: 'currency',
        currency: 'HUF',
        maximumFractionDigits: 0
    });
    return formatter.format(value);
}

export function knifeTypeFormatter(type) {
    switch (type) {
        case "penknife":
            return "bicska";
        case "dagger":
            return "tőr";
        case "kitchen_knife":
            return "konyhakés";
        default:
            return "-";
    }
}

export function customerDataFormatter(field) {
    switch (field) {
        case "email":
            return "Email";
        case "phone":
            return "Telefon";
        case "post_code":
            return "Irányítószám";
        case "settlement":
            return "Település";
        case "street":
            return "Utca";
        case "details":
            return "Házszám";
        case "bill_post_code":
            return "Ir.szám (számlázási)";
        case "bill_settlement":
            return "Település (számlázási)";
        case "bill_street":
            return "Utca (számlázási)";
        case "bill_details":
            return "Házszám (számlázási)";
        case "bill_name":
            return "Számlázási név"; 
        default:
            return "-";
    }
}