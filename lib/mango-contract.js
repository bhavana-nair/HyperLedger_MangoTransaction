/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class MangoContract extends Contract {

    async mangoExists(ctx, mangoId) {
        const buffer = await ctx.stub.getState(mangoId);
        return (!!buffer && buffer.length > 0);
    }

    async createMango(ctx, mangoId, batchNumber, producer, quantity, price) {
        const exists = await this.mangoExists(ctx, mangoId);
        if (exists) {
            throw new Error(`The mango ${mangoId} already exists`);
        }
        const asset = {
            ID: mangoId,

            BatchNumber: batchNumber,
            
            Producer: producer,
            
            OwnedBy: producer,
            
            Quantity: quantity,
            
            Price: price, };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(mangoId, buffer);
    }

    async readMango(ctx, mangoId) {
        const exists = await this.mangoExists(ctx, mangoId);
        if (!exists) {
            throw new Error(`The mango ${mangoId} does not exist`);
        }
        const buffer = await ctx.stub.getState(mangoId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateMango(ctx, mangoId, batchNumber, producer, owner, quantity, price) {
        const exists = await this.mangoExists(ctx, mangoId);
        if (!exists) {
            throw new Error(`The mango ${mangoId} does not exist`);
        }
        const asset = { 
            
BatchNumber: batchNumber,

Producer: producer,

OwnedBy: owner,

Quantity: quantity,

Price: price,
         };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(mangoId, buffer);
    }

    async deleteMango(ctx, mangoId) {
        const exists = await this.mangoExists(ctx, mangoId);
        if (!exists) {
            throw new Error(`The mango ${mangoId} does not exist`);
        }
        await ctx.stub.deleteState(mangoId);
    }

    async sellMangos(ctx, mangoId, ownerName) {
        const exists = await this.mangoExists(ctx, mangoId); 
        if (!exists) 
        {
            throw new Error(`The apple ${mangoId} does not exist`);
        }
        const asset = { currentOwner: ownerName };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(mangoId, buffer);
    }

}

module.exports = MangoContract;
