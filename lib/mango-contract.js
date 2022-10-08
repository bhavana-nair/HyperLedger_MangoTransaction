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

    async createMango(ctx, mangoId, value) {
        const exists = await this.mangoExists(ctx, mangoId);
        if (exists) {
            throw new Error(`The mango ${mangoId} already exists`);
        }
        const asset = { value };
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

    async updateMango(ctx, mangoId, newValue) {
        const exists = await this.mangoExists(ctx, mangoId);
        if (!exists) {
            throw new Error(`The mango ${mangoId} does not exist`);
        }
        const asset = { value: newValue };
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

}

module.exports = MangoContract;
