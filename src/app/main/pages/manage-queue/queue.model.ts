
export class Queue
{
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
            this.id = queue.id || '';
            this.name = queue.name || '';
            this.dateReceived = queue.dateReceived || new Date();
            this.agentInQueue = queue.agentInQueue || '';
        }
    }
}