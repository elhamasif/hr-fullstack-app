import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,

    private readonly configService: ConfigService, // inject ConfigService
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY', { infer: true })!,
      {
        apiVersion: '2025-04-30.basil',
      },
    );
  }

  async createCheckoutSession(dto: CreatePaymentDto) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: dto.description,
          },
          unit_amount: dto.amount * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      metadata: {
        employeeId: dto.employeeId.toString(),
      },
      success_url: 'http://localhost:3000/successPayment?session_id={CHECKOUT_SESSION_ID}',

     cancel_url: 'http://localhost:3001/payment/cancel',
    });

    await this.paymentRepo.save({
      employeeId: dto.employeeId,
      stripeSessionId: session.id,
      status: 'pending',
      amount: dto.amount,
      description: dto.description,
    });

    return { url: session.url };
  }



  async handleWebhook(event: Stripe.Event) {
    console.log('Webhook event type:', event.type);
  
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Session ID from Stripe:', session.id);
  
      const payment = await this.paymentRepo.findOne({
        where: { stripeSessionId: session.id },
      });
      console.log('Fetched payment from DB:', payment);
  
      if (!payment) {
        console.log('⚠️ Payment not found in DB.');
        return;
      }
  
      const result = await this.paymentRepo.update(
        { stripeSessionId: session.id },
        { status: 'success' },
      );
      console.log('Update result:', result);
    }
  }
}
