import { MatChipInputEvent } from '@angular/material/chips';

import { FuseUtils } from '@fuse/utils';

export class Agent {
    id: string;
    password: string;
    dateReceived: Date;
    online: boolean;
    talking: number;
    agentInQueue: string[];

    // name: string;
    handle: string;
    // description: string;
    // categories: string[];
    // tags: string[];
    // images: {
    //     default: boolean,
    //     id: string,
    //     url: string,
    //     type: string
    // }[];
    // priceTaxExcl: number;
    // priceTaxIncl: number;
    // taxRate: number;
    // comparedPrice: number;
    // quantity: number;
    // sku: string;
    // width: string;
    // height: string;
    // depth: string;
    // weight: string;
    // extraShippingFee: number;
    // active: boolean;

    /**
     * Constructor
     *
     * @param agent
     */
    constructor(agent?) {
        agent = agent || {};
        this.id = agent.id || '';
        this.password = agent.password || '';
        this.dateReceived = agent.dateReceived || new Date();
        this.online = agent.online || false;
        this.talking = agent.talking || 0;
        this.agentInQueue = agent.agentInQueue || '';

        //this.id = agent.id || FuseUtils.generateGUID();
        // this.name = agent.name || '';
        this.handle = agent.handle || FuseUtils.handleize(this.id);
        // this.description = agent.description || '';
        // this.categories = agent.categories || [];
        // this.tags = agent.tags || [];
        // this.images = agent.images || [];
        // this.priceTaxExcl = agent.priceTaxExcl || 0;
        // this.priceTaxIncl = agent.priceTaxIncl || 0;
        // this.taxRate = agent.taxRate || 0;
        // this.comparedPrice = agent.comparedPrice || 0;
        // this.quantity = agent.quantity || 0;
        // this.sku = agent.sku || 0;
        // this.width = agent.width || 0;
        // this.height = agent.height || 0;
        // this.depth = agent.depth || 0;
        // this.weight = agent.weight || 0;
        // this.extraShippingFee = agent.extraShippingFee || 0;
        // this.active = agent.active || true;
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
