import { PaymentOperation, RandomGenerator } from '@hachther/mesomb';

const application_key="b32c11719876f57f4e268f6b4cb0b2c63b5de380"
const access_key="ab0124cd-3a69-4f19-9eed-d3f82dfbaeb4"
const secret_key="8d8536cb-d804-4aff-acd1-81c8772a4a14"


export const getApplicationStatus = async () => {
    const payment = new PaymentOperation({applicationKey: process.env.application_key, accessKey: process.env.access_key, secretKey: process.env.secret_key});
    const application = await payment.getStatus();
}

export const getTransactionByIDs = async ({IDs}) => {
    const payment = new PaymentOperation({applicationKey: process.env.application_key, accessKey: process.env.access_key, secretKey: process.env.secret_key});
    const transactions = await payment.getTransactions([...IDs]);
}


export const collectMoney = async ({amount, service, payer}) => {
    try {
        const payment = await new PaymentOperation({applicationKey: application_key, accessKey: access_key, secretKey: secret_key});
        const response = await payment.makeCollect({amount: amount, service: service, payer: payer, nonce: RandomGenerator.nonce()});
        console.log(response, 24)
        return { operation: response.isOperationSuccess(), transaction: response.isTransactionSuccess() }
    } catch (error) {
        var err = {...error}
        if (err?.code?.includes("low-balance-payer")){
            return { operation: false, transaction: "low-balance-payer" }
        }
        if (err?.code?.includes("ENOTFOUND")){
            return { operation: false, transaction: "ENOTFOUND" }
        }
        if (err?.code?.includes("could-not-perform-transaction")){
            return { operation: false, transaction: "Cancel By User" }
        }
        if (err?.code?.includes("invalid-amount")){
            return { operation: false, transaction: "The-amount-should-be-greater-than-10-XAF" }
        }
        console.log(error)
        return { operation: false, transaction: "Failed Operation" }
    }
}


export const depositMoney = async ({amount, service, reciever}) => {
    const payment = new PaymentOperation({applicationKey: process.env.application_key, accessKey: process.env.access_key, secretKey: process.env.secret_key});
    const response = await payment.makeDeposit({amount: amount, service: service, receiver: reciever, nonce: RandomGenerator.nonce()});
}
