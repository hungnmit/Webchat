import { FuseUtils } from '@fuse/utils';

export class Info
{
    id: string;
    name: string;
    lastName: string;
    avatar: string;
    nickname: string;
    company: string;
    jobTitle: string;
    email: string;
    phone: string;
    address: string;
    birthday: string;
    notes: string;

    /**
     * Constructor
     *
     * @param info
     */
    constructor(info)
    {
        {
            this.id = info.id || FuseUtils.generateGUID();
            this.name = info.name || '';
            this.lastName = info.lastName || '';
            this.avatar = info.avatar || 'assets/images/avatars/profile.jpg';
            this.nickname = info.nickname || '';
            this.company = info.company || '';
            this.jobTitle = info.jobTitle || '';
            this.email = info.email || '';
            this.phone = info.phone || '';
            this.address = info.address || '';
            this.birthday = info.birthday || '';
            this.notes = info.notes || '';
        }
    }
}
