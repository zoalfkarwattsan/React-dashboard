const PluggedInModules = {}

try {
    PluggedInModules['user'] = {path: require('@devModules/user'), enabled: true} // special user Module ()
} catch (e) {
    console.error('No User Module', e)
}

try {
    PluggedInModules['roles_permissions'] = {path: require('@devModules/rolespermissions'), enabled: true} // special user Module ()
} catch (e) {
    console.error('No Role & Permissions Module', e)
}

export default PluggedInModules
