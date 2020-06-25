
export class Queue
{
    // id: string;
    // password: string;
    // dateReceived: Date;
    // online: boolean;
    // talking: number;
    // agentInQueue: string[];

    id: string;
    name: string;
    dateReceived: Date;
    agentInQueue: string[];
    /**
     * Constructor
     *
     * @param queue
     */
    constructor(queue)
    {
        {
            // this.id = queue.id || '';
            // this.password = queue.password || '';
            // this.dateReceived = queue.dateReceived || new Date();
            // this.online = queue.online || false;
            // this.talking = queue.talking || 0;
            // this.agentInQueue = queue.agentInQueue || '';

            this.id = queue.id || '';
            this.name = queue.name || '';
            this.dateReceived = queue.dateReceived || new Date();
            this.agentInQueue = queue.agentInQueue || '';
        }
    }
}