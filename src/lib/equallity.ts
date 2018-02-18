export function objectPropEquals<T>(object1: T, object2: T, supplier: (obj: T) => any): boolean {
    if (object1 && object2) {
        return supplier(object2) === supplier(object1)
    }

    if (!object1 && !object2) return true

        return false
}

export function arrayEquals<T>(arr1: T[], arr2: T[], supplier?: (obj: T) => any) {
    const length = arr1.length;
    if (length !== arr2.length) return false
    for (let i = 0; i < length; i++) {
        if (supplier) {
            if (supplier(arr1[i]) !== supplier(arr2[i])) {
                return false
            }
        } else {
            if (arr1[i] !== arr2[i]) {
                return false
            }
        }
    }

    return true
}