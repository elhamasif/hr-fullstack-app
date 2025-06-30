import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
// If hello is not defined in the same file, you can remove this import


@Module({
  imports: [TypeOrmModule.forFeature([Payment])], // Assuming hello is an entity, adjust as necessary
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}