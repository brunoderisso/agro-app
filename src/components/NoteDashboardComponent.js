import { Component } from "react";
import TaskStore from "../stores/TaskStore";
import StatusStore from "../stores/StatusStore";

class NoteDashboardComponent extends Component {
    constructor(props) {
        super(props);
        this.props = props
        this.state = {
            tasks: null,
            status: {}
        }
        this.open = false
    }
    componentWillUnmount() {
        this.open = false
    }
    componentDidMount() {
        this.open = true
        TaskStore.on("update_task", () => {
            if(!this.open){
                return 
            }
            this.getTasks();
        })
        TaskStore.on("add_task", () => {
            if(!this.open){
                return 
            }
            this.getTasks();
        })
        StatusStore.on("add_status", () => {
            if(!this.open){
                return 
            }
            this.getTasks();
            this.changeState("status", "name", "");
        })
        this.getTasks();
    };

    //Event methods

    //Component methods


    onChangeInput = propriety => event => {
        this.changeState("status", propriety, event.target.value);
    };

    changeState(object, propriety, value) {
        let actv = this.state[object];
        actv[propriety] = value;
        this.setState({ [object]: actv });
    };
    //Store methods

    addStatus = () => {
        StatusStore.addStatus({name:this.state.status.name,description:this.state.status.name});
    }

    responseGetTasks = (val) => {
        this.setState({ tasks: val });
    };

    getTasks = () => {
        TaskStore.getTasks(this.responseGetTasks);
    };

    drag = (source, destination) => {
        
        const sourceColumn = this.state.tasks[source.droppableId];
        const destColunm = this.state.tasks[destination.droppableId];
        const [removed] = sourceColumn.splice(source.index, 1);
        destColunm.splice(destination.index, 0, removed);

        let cols = this.state.tasks;

        cols[source.droppableId] = sourceColumn;
            
        cols[destination.droppableId] = destColunm;

        this.setState({ tasks: cols });

    }

    drop = (source, destination) => {
        const column = this.state.tasks[source.droppableId];
        const copiedItems = [...column];
        const [removed] = copiedItems.splice(source.index, 1);

        copiedItems.splice(destination.index, 0, removed);

        let cols = this.state.tasks;

        cols[source.droppableId] = copiedItems

        this.setState({ tasks: cols });
    }

    getDropChange = (after, before) => {
        let cols = [];
        after.forEach((val, index) => {
            if (val.objectid !== before[index].objectid) {
                cols.push({ id: index, task: val })
            }
        })
        return cols

    }

    onDragEnd = (result) => {
        if (!result.destination) return;

        //source -> origem
        //destination -> destino

        const { source, destination } = result;

        if (source.droppableId !== destination.droppableId) {
            this.drag(source, destination);
        } else {
            this.drop(source, destination);
        }

    }
}

export default NoteDashboardComponent;