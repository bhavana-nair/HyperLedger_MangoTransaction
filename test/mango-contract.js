/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { MangoContract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logger = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('MangoContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new MangoContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"mango 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"mango 1002 value"}'));
    });

    describe('#mangoExists', () => {

        it('should return true for a mango', async () => {
            await contract.mangoExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a mango that does not exist', async () => {
            await contract.mangoExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createMango', () => {

        it('should create a mango', async () => {
            await contract.createMango(ctx, '1003', 'mango 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"mango 1003 value"}'));
        });

        it('should throw an error for a mango that already exists', async () => {
            await contract.createMango(ctx, '1001', 'myvalue').should.be.rejectedWith(/The mango 1001 already exists/);
        });

    });

    describe('#readMango', () => {

        it('should return a mango', async () => {
            await contract.readMango(ctx, '1001').should.eventually.deep.equal({ value: 'mango 1001 value' });
        });

        it('should throw an error for a mango that does not exist', async () => {
            await contract.readMango(ctx, '1003').should.be.rejectedWith(/The mango 1003 does not exist/);
        });

    });

    describe('#updateMango', () => {

        it('should update a mango', async () => {
            await contract.updateMango(ctx, '1001', 'mango 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"mango 1001 new value"}'));
        });

        it('should throw an error for a mango that does not exist', async () => {
            await contract.updateMango(ctx, '1003', 'mango 1003 new value').should.be.rejectedWith(/The mango 1003 does not exist/);
        });

    });

    describe('#deleteMango', () => {

        it('should delete a mango', async () => {
            await contract.deleteMango(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a mango that does not exist', async () => {
            await contract.deleteMango(ctx, '1003').should.be.rejectedWith(/The mango 1003 does not exist/);
        });

    });

});
