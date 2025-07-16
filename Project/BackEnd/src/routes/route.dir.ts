

export const authPath = {
    REGISTER : '/register',
    LOGIN : '/login',
    LOGOUT : '/logout',
    REFRESHTOKEN : '/refresh-token' 

}

export const orderPath = {
    MAKEORDER : '/makeOrder',
    GETALLORDER : '/getAllOrder',
    EDITORDER : '/editOrder/:id',
    GETFILTEREDORDER: '/getFilteredOrder',
}

export const menuPath = {
    GETMENU : '/getMenu',
    ADDMENU : '/addMenu',
    DELETEMENU : '/deleteMenu/:id',
}

export const tablePath = {
    GETTABLE : '/getTable',
    ADDTABLE : '/addTable',
    EDITTABLE : '/editTable/:id',
}


export const invoicePath ={
    GENERATEINVOICE : '/generateInvoice/:id',
    TOGGLEINVOICE : '/toggleInvoice/:id',
    GETINVOICE : '/getInvoice',
    GETINVOICEBYID: '/getInvoice/:id'

}