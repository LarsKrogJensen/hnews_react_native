

export function objectPropEquals<T>(object1: T, object2: T, supplier: (obj: T)=> any): boolean {
    if (object1 && object2) {
        return supplier(object2) === supplier(object1)
    }

    return false
}