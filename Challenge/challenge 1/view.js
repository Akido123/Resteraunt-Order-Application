import { TABLES, COLUMNS, state } from './data.js'

/**
 * Takes any order as an object literal (as saved in state) and converts it a
 * HTML element that can be appended to the DOM. Creating order elements
 * individually prevents the JavaScript having to re-render the entire DOM every
 * time an new order is created.
 *
 * @param {object} order 
 * @returns {HTMLElement}
 */
export const createOrderHtml = (order) => {
    const { id, title, table, created } = order

    const element = document.createElement('div')
    element.className = 'order'
    element.draggable = true
    element.dataset.id = id

    const hours = created.getHours().toString().padStart(2, '0')
    const minutes = created.getMinutes().toString().padStart(2, '0')

    element.innerHTML = /* html */ `
        <div class="order__title" data-order-title>${title}</div>
        
        <dl class="order__details">
            <div class="order__row">
                <dt>Table:</dt>
                <dd class="order__value" data-order-table>${table}</dd>
            </div>

            <div class="order__row">
                <dt>Ordered:</dt>
                <dd class="order__value">${hours}:${minutes}</dd>
            </div>
        </dl>
    `

    return element
}

/**
 * Since the tables in use, and their identification can be configured before
 * the start of the app (in data.js), the actual options returned should be
 * dynamically added to the respective "<select>" elements in the HTML after
 * JavaScript loads. This function executes the logic thar reads the current
 * tables and creates the HTML to select them.
 *
 * @returns {HTMLElement}
 */
const createTableOptionsHtml = () => {
    const fragment = document.createDocumentFragment()

    for (const singleTable of TABLES) {
        const option = document.createElement('option')
        option.value = singleTable
        option.innerText = singleTable
        fragment.appendChild(option)
    }

    return fragment
}

/**
 * An object literal that contains references to all the HTML elements
 * referenced through the operation of the app either upon initialisation or
 * while its running (via event listeners). This ensure that all UI elements can
 * be accessed and seen in a structured manner in a single data structure.
 *
 * Note that the "column" and "area" properties created as empty and then added
 * dynamically by a loop that runs over the COLUMNS array.
 */
export const html = {
    columns: {},
    area: {},
    add: {
        overlay: document.querySelector('[data-add-overlay]'),
        form: document.querySelector('[data-add-form]'),
        cancel: document.querySelector('[data-add-cancel]'),
        title: document.querySelector('[data-add-title]'),
        table: document.querySelector('[data-add-table]'),
    },
    edit: {
        overlay: document.querySelector('[data-edit-overlay]'),
        form: document.querySelector('[data-edit-form]'),
        cancel: document.querySelector('[data-edit-cancel]'),
        title: document.querySelector('[data-edit-title]'),
        table: document.querySelector('[data-edit-table]'),
        id: document.querySelector('[data-edit-id]'),
        column: document.querySelector('[data-edit-column]'),
        delete: document.querySelector('[data-edit-delete]')
    },
    help: {
        overlay: document.querySelector('[data-help-overlay]'),
        cancel: document.querySelector('[data-help-cancel]'),
    },
    other: {
        grid: document.querySelector('[data-grid]'),
        help: document.querySelector('[data-help]'),
        add: document.querySelector('[data-add]'),
        order: document.querySelector('[data-order]'),
    }
}

for (const columnName of COLUMNS) {
    html.columns[columnName] = document.querySelector(`[data-column="${columnName}"]`)
    html.area[columnName] = document.querySelector(`[data-area="${columnName}"]`)
}

/**
 * Maps over all columns in the HTML and removes any dragging hover effects
 * except for the current column that is being dragged over (if at all). If the
 * "over" value is not specified, then all columns will be cleared of any hover
 * effects.
 *
 * @param {object} newDragging 
 */
export const updateDraggingHtml = (newDragging) => {
    const { over = state.dragging.over } = newDragging

    for (const columnName of COLUMNS) {
        const value = columnName === over ? 'rgba(0, 160, 70, 0.2)' : ''
        html.area[columnName].style.backgroundColor = value
    }
}

/**
 * Takes a specific order HTML and clones it into memory. The original HTML
 * element is then removed from the DOM, while the cloned duplicate is added to
 * the bottom of the column that is specified.
 *
 * @param {string} id - The "id" value of a specific order object. Note that
 * only the "id" value is used, not the entire object.
 *
 * @param {string} newColumn - The name of the column that the order should be
 * moved to. This should coincide with one of the values present in the COLUMNS
 * array in "data.js"
 */
export const moveToColumn = (id, newColumn) => {
    const htmlSource = document.querySelector(`[data-id="${id}"]`) 
    const duplicate = htmlSource.cloneNode(true)
    html.columns[newColumn].appendChild(duplicate)
    htmlSource.remove()
}

/**
 * Starts the app focused on the "add order" button. This means that users can
 * immediately started adding an order by pressing the enter or spacebar.
 */
html.other.add.focus()


html.add.table.appendChild(createTableOptionsHtml())
html.edit.table.appendChild(createTableOptionsHtml())