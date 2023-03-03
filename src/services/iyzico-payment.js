import {
  AbstractPaymentService,
  PaymentContext,
  Data,
  Payment,
  PaymentSession,
  PaymentSessionStatus,
  PaymentSessionData,
  Cart,
  PaymentData,
  PaymentSessionResponse,
} from "@medusajs/medusa";

// need to  install iyzipay package
import { Iyzipay } from "iyzipay";

class IyzicoPaymentService extends AbstractPaymentService {
  // protected manager_: EntityManager;
  // protected transactionManager_: EntityManager | undefined;
  static identifier = "iyzico";

  constructor(container, options) {
    super(container);

    this.iyzipay = new Iyzipay({
      apiKey: options.iyzicoTestApiKey,
      secretKey: options.iyzicoTestSecretKey,
      uri: this.iyzicoTestUri,
    });
  }

  async createPayment(context) {
    // type context = {
    //   cart: {
    //     context: Record<string, unknown>
    //     id: string
    //     email: string
    //     shipping_address: Address | null
    //     shipping_methods: ShippingMethod[]
    //   }
    //   currency_code: string
    //   amount: number
    //   resource_id?: string
    //   customer?: Customer
    // }

    //Fill the checkout_data object with the data from the context
    var checkout_data = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: "123456789",
      price: "1", //!
      paidPrice: "1.2", //!
      currency: Iyzipay.CURRENCY.TRY, //!
      installment: "1", //!
      basketId: "B67832",
      paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      paymentCard: {
        cardHolderName: "John Doe", //!
        cardNumber: "5528790000000008", //!
        expireMonth: "12", //!
        expireYear: "2030", //!
        cvc: "123", //!
        registerCard: "0",
      },
      buyer: {
        id: "BY789", //!
        name: "John", //!
        surname: "Doe", //!
        gsmNumber: "+905350000000", //!
        email: "email@email.com", //!
        identityNumber: "74300864791", //!
        lastLoginDate: "2015-10-05 12:43:35",
        registrationDate: "2013-04-21 15:12:09",
        //!
        registrationAddress:
          "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
        ip: "85.34.78.112", //!
        city: "Istanbul", //!
        country: "Turkey", //!
        zipCode: "34732",
      },
      shippingAddress: {
        contactName: "Jane Doe", //!
        city: "Istanbul", //!
        country: "Turkey", //!
        address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1", //!
        zipCode: "34742",
      },
      billingAddress: {
        contactName: "Jane Doe", //!
        city: "Istanbul", //!
        country: "Turkey", //!
        address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1", //!
        zipCode: "34742",
      },
      basketItems: [
        {
          id: "BI101", //!
          name: "Binocular", //!
          category1: "Collectibles", //!
          category2: "Accessories",
          itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL, //!
          price: "0.3",
        },
      ],
    };

    try {
      const res = await this.iyzipay.payment.create(checkout_data);
      return {
        // Return values should be of type PaymentSessionResponse
        // type PaymentSessionResponse = {
        //   update_requests: { customer_metadata: Record<string, unknown> }
        //   session_data: Record<string, unknown>
        // }
        //session_data is the data that is going to be stored in the data field of the Payment Session to be created.
        // As mentioned in the Architecture Overview, the data field is useful to hold any data required by the third-party provider
        //to process the payment or retrieve its details at a later point.
        // update_requests is an object that can be used to pass data from the payment provider plugin to the core to update
        //internal resources. Currently, it only has one attribute customer_metadata which allows updating the
        // metadata field of the customer.

        // Customer metadeta can be filled with the data from the context
        update_requests: { customer_metadata: {} },
        session_data: res,
      };
    } catch (error) {
      throw error;
    }
  }

  async retrievePayment(paymentData) {
    try {
      return await this.iyzipay.payment.retrieve({
        locale: Iyzipay.LOCALE.TR,
        paymentId: paymentData.id,
        // conversationId: "nullable",
        // paymentConversationId: "nullable",
      });
    } catch (error) {
      throw error;
    }
  }

  async getStatus(data) {
    const order = await this.retrievePayment(data);

    return order.status === "success" ? PaymentSessionStatus.AUTHORIZED : PaymentSessionStatus.ERROR;
    
    //Error codes and messages can be seen in order.errorMessage and order.errorCode
  }

  async getPaymentData(paymentSession) {
    try {
      return this.retrievePayment(paymentSession.data);
    } catch (error) {
      throw error;
    }
  }

  async cancelPayment(paymentData) {
    try {
      return await iyzipay.cancel.create({
        locale: Iyzipay.LOCALE.TR, //Used for corresponding error or success messages' language
        paymentId: paymentData.id, //The id of the payment to be cancelled
      });
    } catch (error) {
      throw error;
    }
  }

  async refundPayment(paymentData, refundAmount) {
    try {
      return await iyzipay.refund.create({
        locale: Iyzipay.LOCALE.TR,
        currency: Iyzipay.CURRENCY.TRY,
        price: refundAmount,
        ip: paymentData.ip,
        paymentTransactionId: paymentData.id,

        // conversationId: "123456789", not necessary
      });
    } catch (error) {
      throw error;
    }
  }

  async authorizePayment(paymentSession, context) {
    throw new Error("Method not implemented.");
  }
  async capturePayment(payment) {
    throw new Error("Method not implemented.");
  }
  async updatePaymentData(paymentSessionData, data) {
    throw new Error("Method not implemented.");
  }

  /**
   * Not suported
   */
  async updatePayment(paymentSessionData, cart) {
    throw new Error("Method not implemented.");
  }
   /**
   * Not suported
   */
  async deletePayment(paymentSession) {
    throw new Error("Method not implemented.");
  }
  
  
}

export default IyzicoPaymentService;
