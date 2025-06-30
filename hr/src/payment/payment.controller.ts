import {
    Body,
    Controller,
    Post,
    Headers,
    Req,
    Get,
    Query,
    Res,
    UseGuards,
  } from '@nestjs/common';
  import { PaymentService } from './payment.service';
  import { CreatePaymentDto } from './dto/create-payment.dto';
  import { Request, Response } from 'express';
  import Stripe from 'stripe';
  import { ConfigService } from '@nestjs/config';
  
  @Controller('payment')
  export class PaymentController {
    constructor(
      private paymentService: PaymentService,
      private configService: ConfigService,
    ) {}
    
    @Post('create')
    async createPayment(@Body() dto: CreatePaymentDto) {
      return this.paymentService.createCheckoutSession(dto);
    }
    @Get('success')
paymentSuccess(@Query('session_id') sessionId: string, @Res() res: Response) {
  res.send(`<h1>✅ Payment Success</h1><p>Session ID: ${sessionId}</p>`);
}

@Get('cancel')
paymentCancel(@Res() res: Response) {
  res.send('<h1>❌ Payment Cancelled</h1>');
}
@Post('webhook')
async handleWebhook(
  @Req() req: Request,
  @Res() res: Response,
  @Headers('stripe-signature') signature: string,
) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-04-30.basil',
  });

  const rawBody = (req as any).rawBody;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('✅ Stripe webhook event received:', event.type);

  await this.paymentService.handleWebhook(event); // Make sure this function updates DB

  res.json({ received: true });
}

  }
  