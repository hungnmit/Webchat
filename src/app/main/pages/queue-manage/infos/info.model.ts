import { FuseUtils } from '@fuse/utils';

export class Info
{
    id: string;
    password: string;
    dateReceived: Date;
    online: boolean;
    talking: number;
    agentInQueue: string[];


    // id: string;
    // name: string;
    // lastName: string;
    // avatar: string;
    // nickname: string;
    // company: string;
    // jobTitle: string;
    // email: string;
    // phone: string;
    // address: string;
    // birthday: string;
    // notes: string;

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
