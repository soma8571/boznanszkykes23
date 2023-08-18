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
        case "wright_penknife":
            return "míves bicska";
        default:
            return type;
    }
}

export function customerDataFormatter(field) {
    switch (field) {
        case "cname":
            return "Vásárló neve";
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
            return field;
    }
}

export function deliveryStatusFormatter(status) {
    switch (status) {
        case "PENDING":
            return "Függőben";
        case "CANCELLED":
            return "Visszavont";
        case "COMPLETED":
            return "Teljesült";
        default:
            return status;
    }
}

export function knifeDataFormatter(field) {
    switch (field) {
        case "available":
            return "Elérhető";
        case "blade_length":
            return "Penge hossza";
        case "blade_material": 
            return "Penge anyaga";
        case "blade_width":
            return "Penge vastagsága";
        case "buyable":
            return "Megvásárolható";
        case "description":
            return "Leírás";
        case "full_length":
            return "Teljes hossz";
        case "handle_material":
            return "Markolat anyaga";
        case "hardness":
            return "Keménység";
        case "hide_if_sold_out":
            return "Elrejtés, ha nincs készleten";
        case "name":
            return "Megnevezés";
        case "price":
            return "Ár";
        case "type":
            return "Típus";
        case "type_subcategory":
            return "Típus alkategória";
        case "subcategory_name":
            return "Alkategória";
        case "stock":
            return "Készlet";
        default:
            return field;
    }
}

export const knifeTypes = [
    {
        "name": "penknife",
        "nev": "bicska"
    },
    {
        "name": "dagger",
        "nev": "tőr"
    },
    {
        "name": "kitchen_knife",
        "nev": "konyhakés"
    },
    {
        "name": "wright_penknife",
        "nev": "míves bicska"
    }
];

export function saleFieldFormatter(field) {
    switch (field) {
        case "deadline":
            return "Akció vége";
        case "sale_percentage":
            return "Akció mértéke (%)";
        case "until_in_stock": 
            return "Készlet erejéig";
        case 0:
            return "Nem";
        case 1:
            return "Igen";
        default:
            return field;
    }
}