class Node {
    constructor(value) {
        this.value = value;
        this.parent = null;
        this.leftChild = null;
        this.rightChild = null;
        this.color = "red";
    }
}

class RedBlackTree {
    constructor() {
        this.root = null;
        this.size = 0;
    }
    // Método para insertar un nuevo nodo en el árbol 
    insert(value) {
        // Crea un nuevo nodo con el valor proporcionado 
        const newNode = new Node(value);
        // Si el árbol está vacío, lo establece como la raíz 
        if (this.root === null) {
            newNode.color = "black";
            this.root = newNode;
            this.size++;
            return;
        }
        // Busca el lugar correcto para insertar el nodo 
        let current = this.root;
        while (true) {
            if (value < current.value) {
                if (current.leftChild === null) {
                    current.leftChild = newNode;
                    newNode.parent = current;
                    break;
                }
                current = current.leftChild;
            } else {
                if (current.rightChild === null) {
                    current.rightChild = newNode;
                    newNode.parent = current;
                    break;
                }
                current = current.rightChild;
            }
        }
        // Realiza las rotaciones necesarias para mantener las propiedades del árbol rojinegro 
        this.insertionFixUp(newNode);
        this.size++;
    }
    // Método para corregir las propiedades del árbol después de una inserción 
    insertionFixUp(node) {
        while (node.parent && node.parent.color === "red") {
            if (node.parent === node.parent.parent.leftChild) {
                let uncle = node.parent.parent.rightChild;
                if (uncle && uncle.color === "red") {
                    node.parent.color = "black";
                    uncle.color = "black";
                    node.parent.parent.color = "red";
                    node = node.parent.parent;
                } else {
                    if (node === node.parent.rightChild) {
                        node = node.parent;
                        this.leftRotate(node);
                    }
                    node.parent.color = "black";
                    node.parent.parent.color = "red";
                    this.rightRotate(node.parent.parent);
                }
            } else {
                let uncle = node.parent.parent.leftChild;
                if (uncle && uncle.color === "red") {
                    node.parent.color = "black";
                    uncle.color = "black";
                    node.parent.parent.color = "red";
                    node = node.parent.parent;
                } else {
                    if (node === node.parent.leftChild) {
                        node = node.parent;
                        this.rightRotate(node);
                    }
                    node.parent.color = "black";
                    node.parent.parent.color = "red";
                    this.leftRotate(node.parent.parent);
                }
            }
        }
        this.root.color = "black";
    }
    // Método para eliminar un nodo del árbol 
    delete(value) {
        console.log(value);
        // Busca el nodo a eliminar 
        let node = this.search(value);
        console.log(node);
        if (node === null) {
            return;
        }
        // Si el nodo no tiene hijos, simplemente lo elimina 
        if (node.leftChild === null && node.rightChild === null) {
            if (node === this.root) {
                this.root = null;
            } else {
                if (node.parent.leftChild === node) {
                    node.parent.leftChild = null;
                } else {
                    node.parent.rightChild = null;
                } 
                return this.deletionFixUp(node.parent);
            }
        }
        // Si el nodo tiene un solo hijo, lo reemplaza por su hijo 
        else if (node.leftChild === null || node.rightChild === null) {
            let child = node.leftChild || node.rightChild;
            child.parent = node.parent;
            if (node === this.root) {
                this.root = child;
            } else {
                if (node.parent.leftChild === node) {
                    node.parent.leftChild = child;
                } else {
                    node.parent.rightChild = child;
                }
                return this.deletionFixUp(child);
            }
        }
        // Si el nodo tiene dos hijos, lo reemplaza por su sucesor
        else {
            let successor = this.minimum(node.rightChild);
            node.value = successor.value;
            return this.delete(successor.value);
        }
        this.size--;
    }
    // Método para corregir las propiedades del árbol después de una eliminación 
    deletionFixUp(node) {
        while (node !== this.root && node.color === "black") {
            if (node === node.parent.leftChild) {
                let sibling = node.parent.rightChild;
                if (sibling.color === "red") {
                    sibling.color = "black";
                    node.parent.color = "red";
                    this.leftRotate(node.parent);
                    sibling = node.parent.rightChild;
                }
                if (sibling.leftChild.color === "black" && sibling.rightChild.color === "black") {
                    sibling.color = "red";
                    node = node.parent;
                } else {
                    if (sibling.rightChild.color === "black") {
                        sibling.leftChild.color = "black";
                        sibling.color = "red";
                        this.rightRotate(sibling);
                        sibling = node.parent.rightChild;
                    }
                    sibling.color = node.parent.color;
                    node.parent.color = "black";
                    sibling.rightChild.color = "black";
                    this.leftRotate(node.parent);
                    node = this.root;
                }
            } else {
                let sibling = node.parent.leftChild;
                if (sibling.color === "red") {
                    sibling.color = "black";
                    node.parent.color = "red";
                    this.rightRotate(node.parent);
                    sibling = node.parent.leftChild;
                }
                if (sibling.rightChild.color === "black" && sibling.leftChild.color === "black") {
                    sibling.color = "red";
                    node = node.parent;
                } else {
                    if (sibling.leftChild.color === "black") {
                        sibling.rightChild.color = "black";
                        sibling.color = "red";
                        this.leftRotate(sibling);
                        sibling = node.parent.leftChild;
                    }
                    sibling.color = node.parent.color;
                    node.parent.color = "black";
                    sibling.leftChild.color = "black";
                    this.rightRotate(node.parent);
                    node = this.root;
                }
            }
        }
        node.color = "black";
    }
    // Método para buscar un nodo en el árbol 
    search(value) {
        let current = this.root;
        while (current !== null) {
            if (value === current.value) {
                return current;
            } else if (value < current.value) {
                current = current.leftChild;
            } else {
                current = current.rightChild;
            }
        }
        return null;
    }
    // Método para realizar una rotación izquierda del árbol 
    leftRotate(node) {
        let temp = node.rightChild;
        node.rightChild = temp.leftChild;
        if (temp.leftChild !== null) {
            temp.leftChild.parent = node;
        }
        temp.parent = node.parent;
        if (node.parent === null) {
            this.root = temp;
        } else if (node === node.parent.leftChild) {
            node.parent.leftChild = temp;
        } else {
            node.parent.rightChild = temp;
        }
        temp.leftChild = node;
        node.parent = temp;
    }
    // Método para realizar una rotación derecha del árbol 
    rightRotate(node) {
        let temp = node.leftChild;
        node.leftChild = temp.rightChild;
        if (temp.rightChild !== null) {
            temp.rightChild.parent = node;
        }
        temp.parent = node.parent;
        if (node.parent === null) {
            this.root = temp;
        } else if (node === node.parent.leftChild) {
            node.parent.leftChild = temp;
        } else {
            node.parent.rightChild = temp;
        }
        temp.rightChild = node;
        node.parent = temp;
    }
    // Método para encontrar el nodo con el valor mínimo en el subárbol dado
    minimum(node) {
        while (node.leftChild !== null) {
            node = node.leftChild;
        }
        return node;
    }
}
const tree = new RedBlackTree();
// setTimeout(() => {
//     tree.insert(10);
//     tree.insert(5);
//     tree.insert(15);
//     tree.insert(35);
//     tree.insert(55);
//     tree.insert(2);
//     tree.insert(24);
    
//     console.log(tree.root);
//     console.log(tree.search(35));

//     setTimeout(() => {
//         tree.delete(35);
//     }, 1500)
// });
