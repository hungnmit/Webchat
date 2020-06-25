import { MatChipInputEvent } from '@angular/material/chips';

import { FuseUtils } from '@fuse/utils';

export class Queue {
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

    handle: string;

    /**
     * Constructor
     *
     * @param queue
     */
    constructor(queue?) {
        queue = queue || {};
        this.id = queue.id || '';
        this.name = queue.name || '';
        this.dateReceived = queue.dateReceived || new Date();
        this.agentInQueue = queue.agentInQueue || '';

        this.handle = queue.handle || FuseUtils.handleize(this.id);
    }

    /**
     * Add category
     *
     * @param {MatChipInputEvent} event
     */
    // addCategory(event: MatChipInputEvent): void {
    //     const input = event.input;
    //     const value = event.value;

    //     // Add category
    //     if (value) {
    //         this.categories.push(value);
    //     }

    //     // Reset the input value
    //     if (input) {
    //         input.value = '';
    //     }
    // }

    /**
     * Remove category
     *
     * @param category
     */
    // removeCategory(category): void {
    //     const index = this.categories.indexOf(category);

    //     if (index >= 0) {
    //         this.categories.splice(index, 1);
    //     }
    // }

    /**
     * Add tag
     *
     * @param {MatChipInputEvent} event
     */
    // addTag(event: MatChipInputEvent): void {
    //     const input = event.input;
    //     const value = event.value;

    //     // Add tag
    //     if (value) {
    //         this.tags.push(value);
    //     }

    //     // Reset the input value
    //     if (input) {
    //         input.value = '';
    //     }
    // }

    /**
     * Remove tag
     *
     * @param tag
     */
    // removeTag(tag): void {
    //     const index = this.tags.indexOf(tag);

    //     if (index >= 0) {
    //         this.tags.splice(index, 1);
    //     }
    // }
}
