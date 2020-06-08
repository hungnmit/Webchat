
export class Agent
{
    id: string;
    password: string;
    dateReceived: Date;
    online: boolean;
    talking: number;
    agentInQueue: string[];

    /**
     * Constructor
     *
     * @param agent
     */
    constructor(agent)
    {
        {
            this.id = agent.id || '';
            this.password = agent.password || '';
            this.dateReceived = agent.dateReceived || new Date();
            this.online = agent.online || false;
            this.talking = agent.talking || 0;
            this.agentInQueue = agent.agentInQueue || '';
        }
    }
}