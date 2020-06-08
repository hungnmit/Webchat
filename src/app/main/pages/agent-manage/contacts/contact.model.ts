import { FuseUtils } from '@fuse/utils';

export class Contact
{
    id: string;
    name: string;
    dateReceived: Date;
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
     * @param queue
     */
    constructor(queue)
    {
        {
            this.id = queue.id || '';
            this.name = queue.name || '';
            this.dateReceived = queue.dateReceived || new Date();
            this.agentInQueue = queue.agentInQueue || '';


            // this.id = contact.id || FuseUtils.generateGUID();
            // this.name = contact.name || '';
            // this.lastName = queue.lastName || '';
            // this.avatar = queue.avatar || 'assets/images/avatars/profile.jpg';
            // this.nickname = queue.nickname || '';
            // this.company = queue.company || '';
            // this.jobTitle = queue.jobTitle || '';
            // this.email = queue.email || '';
            // this.phone = queue.phone || '';
            // this.address = queue.address || '';
            // this.birthday = queue.birthday || '';
            // this.notes = queue.notes || '';
        }
    }
}
