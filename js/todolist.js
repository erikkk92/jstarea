
/**
 *
 *
 */
(($) => {
    'use strict';

    const API_URL = 'https://task-backend-fpuna.herokuapp.com/tasks';
    const TASK_STATUS = {
        PENDING: 'PENDIENTE',
        DONE: 'TERMINADO',
        CANCEL: 'CANCELADO'
    };

    class Task {
        constructor(description) {
            this.id = null;
            this.description = description;
            this.status = TASK_STATUS.PENDING;
            this.date = new Date().toUTCString();
        }
    }

    /**
     * This method is executed once the page have just been loaded and call the service to retrieve the
     * list of tasks
     */
    //document.onreadystatechange = () => {
        // TODO ITEM 0: Llamar al API con el método GET para recuperar la lista de tareas existentes.
        //  - Como parámetro `callbackSuccess` envía la función `loadTasks`.
        //  - Como parámetro `callbackError` envía una función que llame al método `showError` enviando un mensaje de
        //    error
        //  - La llamada debe ser asíncrona.
        //Ajax.sendGetRequest(API_URL, null, MediaFormat.JSON, (value) => loadTasks(value), (code) => showError(code, 'ERROR al recuperar'), true);
    //};
    
    $(document).on('readystatechange', () => {
        $.get(API_URL).done(function (data) {
            loadTasks(data);
        }).fail((code) => {
            showError(code, 'ERROR al recuperar');
        });
    });

    /**
     * This method displays an error on the page.
     * @param code the status code of the HTTP response.
     * @param text error message
     */


    /**
     * This method receives the list of tasks and calls the method to add each of them to the page
     *
     * @param array the string coming on the body of the API response
     */
    const loadTasks = (tasks) => {
        for (let i in tasks) {
            if (tasks.hasOwnProperty(i)) {
                addTaskToList(tasks[i]);
            }
        }
    };
    /**
     * Send the request to the API to create a new task
     *
     * @param e the event from the click on the new item button
     * @return {boolean}
     */
    const addTask = (e) => {

        //let newTaskInput = document.getElementById("new-task");
        //let content = newTaskInput.value;
        let newTaskInput = $("#new-task");
        let content = newTaskInput.val();
        if (content.length === 0) return false;

        e.preventDefault();

        let task = new Task(content);
        // TODO ITEM 1: Llamar al API con el método POST para crear una nueva tarea.
        //  - Como parámetro `callbackSuccess` envía una función que llame al método `addTaskToList` enviando la
        //    variable `task` y limpia el valor del input#new-task.
        //  - Como parámetro `callbackError` envía una función que llame al método `showError` enviando un mensaje de
        //    error
        //  - La llamada debe ser asíncrona.
        //  - No te olvides de envíar el parámetro `task` para que se cree la tarea.
        //Ajax.sendPostRequest(API_URL, task, MediaFormat.JSON, (value) => addTaskToList(JSON.parse(value)), (code) => showError(code, 'No se pudo agregar la tarea'), true);
        $.ajax({
            method: "POST",
            url: API_URL,
            data: JSON.stringify(task),
            contentType: 'application/json'
        }).done((value) => {
            addTaskToList(value);
        }).fail((code) => {
            console.log(code);
            showError(code, 'No se pudo agregar la tarea');
        });
        //newTaskInput.value = "";
        newTaskInput.val("");
        return false;
    };

    /**
     * This procedure links the new task button the addTask method on the click event.
     */
    //let addButtons = document.getElementsByClassName('add');
    //for (let i in addButtons)
    //    addButtons.item(Number(i)).onclick = (e) => addTask(e);
    
    let addButtons = $('.add');
    addButtons.click((e) => {
        addTask(e);
    });

    /**
     * We associate a function to manipulate the DOM once the checkbox value is changed.
     * Change the task to the completed or incomplete list (according to the status)
     */
//    const addOnChangeEvent = (task) => {
    //    const checkBox = document.getElementById(`task-${task.id}`).querySelector('label > input');
    //    checkBox.onchange = (e) => {
        const addOnChangeEvent = (task) => {
            const checkBox = $('#task-' + task.id).find('label').find('input');
    
            checkBox.click(function () {
            // TODO ITEM 3: leer el nuevo estado de la tarea (que solo puede ser TERMINADO(true) or PENDIENTE(false)) accediendo a la
            //  propiedad `e.target.checked`. Con éste nuevo dato, debes mostrar la tarea junto con las tareas de su
            //  mismo estado (e.g. si la tarea estaba pendiente pero el usuario hace click en el checkbox, el estado de
            //  la tarea debe cambiar a terminada y debe ahora mostrarse con las otras tareas terminadas).
            // - Una forma de hacerlo es remover directamente el archivo con el id `task-${task.id}` del DOM HTML
            // y luego llamar a la función `addTaskToList` que re-creara la tarea con el nuevo estado en el lugar correcto.
            // - No te olvides de llamar al API (método PUT) para modificar el estado de la tarea en el servidor.
            //if (e.target.checked) {
            //    document.getElementById(`task-${task.id}`).remove();
            //    task.status = TASK_STATUS.DONE;
            //    addTaskToList(task);
            //    Ajax.sendPutRequest(API_URL + "/" + task.id, task, MediaFormat.JSON,
            //        (value) => console.log(value),
            //        (code, value) => showError(code, 'Error al cambiar estado'),
            //        true);
            //}
                console.log($(this).prop("checked"));
                if ($(this).prop("checked")) {
                    task.status = TASK_STATUS.DONE;
                }else{
                    task.status = TASK_STATUS.PENDING;
                }
                $('#task-' + task.id).remove();
                $.ajax({
                    method: "PUT",
                    url: API_URL + "/" + task.id,
                    data: JSON.stringify(task),
                    contentType: 'application/json'
                }).done((value) => {
                    addTaskToList(value);

                }).fail((code) => {
                    showError(code, 'Error al cambiar estado');
                });
            });
    };
        //};
    //};

    /**
     * This method modifies the DOM HTML to add new items to the task list.
     * @param task the new task.
     */
    //const addTaskToList = (task) => {
    //    console.log(task);
    //    let newItem = document.createElement('li');
    //    newItem.setAttribute('id', `task-${task.id}`);

    //    let label = document.createElement('label');
    //    label.innerHTML = `<input type="checkbox" ${task.status === TASK_STATUS.DONE ? "checked" : ""}/> ${task.description}`;

    //    let editButton = document.createElement('button');
    //    editButton.innerText = 'Editar';
    //    editButton.classList.add('edit');
    //    editButton.setAttribute('data-id', task.id);
    //    editButton.onclick = (e) => editTask(e);

    //    let deleteButton = document.createElement('button');
    //    deleteButton.innerText = 'Borrar';
    //    deleteButton.classList.add('delete');
    //    deleteButton.setAttribute('data-id', task.id);
    //    deleteButton.onclick = (e) => removeTask(e);

    //    newItem.appendChild(label);
    //    newItem.appendChild(editButton);
    //    newItem.appendChild(deleteButton);

    //    if (task.status === TASK_STATUS.PENDING)
    //        document.getElementById('incomplete-tasks').appendChild(newItem);
    //    else
    //        document.getElementById('completed-tasks').appendChild(newItem);

    //    addOnChangeEvent(task);
    //};
    const addTaskToList = (task) => {
        let newItem = $('<li id="task-' + task.id + '"></li>');

        let label = $('<label></label>');
        if (task.status !== TASK_STATUS.CANCEL) {
            let checked = "";
        if (task.status === TASK_STATUS.DONE){
            checked = "checked";
        }
        label.html('<input type="checkbox" ' + checked+' />'+ task.description);
        } else {
            label.html(task.description);
        }
        let textEditButton = "<button class='edit' data-id='" + task.id + "'>Editar</button>";
        let editButton = $(textEditButton);
        editButton.click((e) => {
            editTask(e);
        });

        let textDeleteButton = "<button class='delete' data-id='" + task.id + "'>Borrar</button>";
        let deleteButton = $(textDeleteButton);
        deleteButton.click((e) => {
            removeTask(e);
        });

        newItem.append(label);
        newItem.append(editButton);
        newItem.append(deleteButton);


        if (task.status === TASK_STATUS.PENDING)
            $('#incomplete-tasks').append(newItem);
        else if (task.status === TASK_STATUS.DONE)
            $('#completed-tasks').append(newItem);
        else
            $('#canceled-tasks').append(newItem);
        if (task.status !== TASK_STATUS.CANCEL) {
            addOnChangeEvent(task);
        }
    };

    /**
     * This method modifies the DOM HTML to display a form that allow the user to change the
     * task description and send a PUT request to modify it on the server side
     *
     * @param e
     */
    const editTask = (e) => {
        // We retrieve the value of the attribute data-id;
         const id = e.target.dataset.id;

        //let currentDOMTask = document.getElementById(`task-${id}`);
        //currentDOMTask.querySelector("label > input[type=checkbox]").remove();
         let currentDOMTask = $('#task-' + id);
         currentDOMTask.find("input[type=checkbox]").remove();

        //let currentTask = new Task(currentDOMTask.querySelector("label").innerHTML.trim());
        //currentTask.id = id;
        let currentTask = new Task(currentDOMTask.find("label").text().trim());
        currentTask.id = id;

       // currentDOMTask.querySelector('label').remove();

        currentDOMTask.find('label').remove();

       // let inputText = document.createElement('input');
       // inputText.setAttribute('id', `task-edit-${currentTask.id}`);
       // inputText.setAttribute('type', 'text');
       // inputText.setAttribute('value', currentTask.description);
        let inputText = $("<input id='task-edit-" + id + "' type='text' value='" + currentTask.description + "' />"); 
        /**
         * We associate the event click on the button ok, to send a PUT request to the server.
         */
        let buttonOK = $('<button id="ok-button-' + id + '">OK</button>');
        buttonOK.click((e) => {
            currentTask.description = $('#task-edit-' + id).val();
            // TODO ITEM 2: llamar a la API con el método PUT cuando la descripción de la tarea es
            //  modificada (`currentTask`).
            //  - Como parámetro `callbackSuccess` envía una función que llame al método `revertHTMLChangeOnEdit`
            //    enviando la variable `currentTask`.
            //  - Como parámetro `callbackError` envía una función que llame al método `showError` enviando un mensaje de
            //    error
            //  - La llamada debe ser asíncrona.
            //  - No te olvides de envíar el parámetro para que se cree la tarea.
            $.ajax({
                method: "PUT",
                url: API_URL + "/" + currentTask.id,
                data: JSON.stringify(currentTask),
                contentType: 'application/json'
            }).done((value) => {
                revertHTMLChangeOnEdit(value);
            }).fail((code) => {
                showError(code, 'No se pudo editar la tarea.');
            });

        });
       
        let buttonCancel = $('<button id="cancel-button-' + id + '">Cancel</button>');
        buttonCancel.click(function () {
            revertHTMLChangeOnEdit(currentTask)
        });

        currentDOMTask.prepend(buttonCancel);
        currentDOMTask.prepend(buttonOK);
        currentDOMTask.prepend(inputText);
        currentDOMTask.find('.edit').css("visibility", 'hidden');
        currentDOMTask.find('.delete').css("visibility", 'hidden');
        currentDOMTask.find('.cancel').css("visibility", 'hidden');
        inputText.focus();
    };

    /**
     * This method removes the form displayed to edit the task and show it as a task item.
     * @param currentTask the string coming from the API
     */
    const revertHTMLChangeOnEdit = (currentTask) => {
        let task = currentTask;
        let currentDOMTask = $('#task-' + task.id);
        $('#task-' + task.id).find('input[type=text]').remove();
        currentDOMTask.find('input[type=text]').remove();

        let label = $("<label></label>");
        currentDOMTask.prepend(label);
        label.html("<input type='checkbox'/>" + task.description);
        currentDOMTask.prepend(label);
        currentDOMTask.find('button#ok-button-'+task.id).remove();
        currentDOMTask.find('button#cancel-button-'+task.id).remove();
        currentDOMTask.find('.edit').css('visibility', 'visible');
        currentDOMTask.find('.delete').css('visibility', 'visible');
        currentDOMTask.find('.cancel').css('visibility', 'visible');
    };

    /**
     * This methods removes the task item associated to the DOM of the page
     * @param id the identifier from the task
     */
    const removeTaskFromList = (id) => {
        // TODO ITEM 4: remover del DOM HTML el elemento con id `task-${id}`
        //document.getElementById(`task-${id}`).remove();
        $('#task-' + id).remove();
    };

    /**
     * This method sends a DELETE request to remove the task from the server.
     * @param e
     */
    const removeTask = (e) => {
        const id = e.target.dataset.id;
        // TODO ITEM 5: enviar una petición DELETE al API con el {id} de la tarea.
        //   - Como parámetro `callbackSuccess` enviar una función que llamé al método `removeTaskFromList`
        //     enviando el id de la tarea.
        //   - Como parámetro `callbackError` enviar una función que llame al método `showError` enviando
        //     un mensaje de error
        //   - La llamada debe ser asíncrona.
        $.ajax({
            method: "DELETE",
            url: API_URL + '/' + id
        }).done((value) => {
            removeTaskFromList(id);
        }).fail((code) => {
            showError(code, 'La tarea no ha podido ser a�adida.');
        });
    };
})
(jQuery);