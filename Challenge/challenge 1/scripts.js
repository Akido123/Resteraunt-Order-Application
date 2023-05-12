import { createOrderData } from './data.js';
import {html, createOrderHtml, moveToColumn} from './view.js'

/**
 * A handler that fires when a user drags over any element inside a column. In
 * order to determine which column the user is dragging over the entire event
 * bubble path is checked with `event.path` (or `event.composedPath()` for
 * browsers that don't support `event.path`). The bubbling path is looped over
 * until an element with a `data-area` attribute is found. Once found both the
 * active dragging column is set in the `state` object in "data.js" and the HTML
 * is updated to reflect the new column.
 *
 * @param {Event} event 
 */
const handleDragOver = (event) => {
  event.preventDefault();
  const path = event.path || event.composedPath()
  let column = null

  for (const element of path) {
      const { area } = element.dataset
      if (area) {
          column = area
          break;
      }
  }

  if (!column) return
  updateDragging({ over: column })
  updateDraggingHtml({ over: column })
}


const handleDragStart = (event) => {
  
}
const handleDragEnd = (event) => {}
const handleHelpToggle = (event) => {
    if(!html.help.overlay.open) {
      html.help.overlay.showModal()
    }
    else{
      html.help.overlay.close()
    }

    html.help.cancel.addEventListener('click', () => {html.help.overlay.close()})
}
const handleAddToggle = (event) => {
  if(!html.add.overlay.open) {
    html.add.overlay.showModal()
  }
  else{
    html.add.overlay.close()
  }

  html.add.cancel.addEventListener('click', () => {html.add.overlay.close()})
  html.add.form.reset()
}
const handleAddSubmit = (event) => {
  event.preventDefault()
  const order = {
    id : null, 
    title : document.querySelector('[data-add-title]').value,
    table : document.querySelector('[data-add-table]').value,
    column : document.querySelector('[data-column="ordered"]'),
    created : null,
  };
  document.querySelector('[data-column="ordered"]').appendChild(createOrderHtml(createOrderData(order)))
  html.add.overlay.close()
  html.add.form.reset()
}
const handleEditToggle = (event) => {
  if(!html.edit.overlay.open){
    html.edit.overlay.showModal()
  }
  else{
    html.edit.overlay.close()
  }

  html.edit.cancel.addEventListener('click', html.help.overlay.close())
  if (event.target.dataset.id){
    const editOrderTitle = document.querySelector('[data-edit-title]')
    editOrderTitle.value = event.target.children[0].textContent
    const editOrderTable = document.querySelector('[data-edit-table]')
    editOrderTable.selectedIndex = (event.target.children[1].children[0].children[1].textContent - 1)
    const editOrderId = document.querySelector('[data-edit-id]')
    editOrderId.setAttribute('data-edit-id', event.target.dataset.id)
  }
}
const handleEditSubmit = (event) => {
  event.preventDefault()
  const activeElementId = document.querySelector('[data-edit-id]')
  const actualId = activeElementId.getAttribute('data-edit-id')
  const activeElementSelector = document.querySelector('[data-edit-column]')
  const actualColumn = activeElementSelector.value
  moveToColumn(actualId,actualColumn)
  const orderId = document.querySelector(`[data-id="${actualId}"]`)
  orderId.children[0].textContent = document.querySelector('[data-edit-title]').value
  orderId.children[1].children[0].children[1].textContent = document.querySelector('[data-edit-table]').value
  html.edit.overlay.close()
}
const handleDelete = (event) => {
  const activeElementId = document.querySelector('[data-edit-id]')
  const actualId = activeElementId.getAttribute('data-edit-id')
  const orderId = document.querySelector(`[data-id="${actualId}"]`)
  orderId.remove()
  html.edit.overlay.close()
}

html.add.cancel.addEventListener('click', handleAddToggle)
html.other.add.addEventListener('click', handleAddToggle)
html.add.form.addEventListener('submit', handleAddSubmit)

html.other.grid.addEventListener('click', handleEditToggle)
html.edit.cancel.addEventListener('click', handleEditToggle)
html.edit.form.addEventListener('submit', handleEditSubmit)
html.edit.delete.addEventListener('click', handleDelete)

html.help.cancel.addEventListener('click', handleHelpToggle)
html.other.help.addEventListener('click', handleHelpToggle)

for (const htmlColumn of Object.values(html.columns)) {
  htmlColumn.addEventListener('dragstart', handleDragStart)
  htmlColumn.addEventListener('dragend', handleDragEnd)
}

for (const htmlArea of Object.values(html.area)) {
  htmlArea.addEventListener('dragover', handleDragOver)
}