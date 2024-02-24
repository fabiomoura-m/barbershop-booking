'use client';

import { Prisma } from '@prisma/client';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { format, isFuture, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from './ui/sheet';
import Image from 'next/image';
import { Button } from './ui/button';
import { cancelBooking } from '../_actions/cancel-booking';
import { toast } from 'sonner';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from './ui/alert-dialog';
import BookingInfo from './booking-info';

interface BookingItemProps {
    booking: Prisma.BookingGetPayload<{
        include: {
            service: true;
            barbershop: true;
        };
    }>;
}

const BookingItem = ({ booking }: BookingItemProps) => {
    const isBookingConfirmed = isFuture(booking.date);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);

    const handleCancelClick = async () => {
        setIsDeleteLoading(true);
        try {
            await cancelBooking(booking.id);

            toast.success('Reserva cancelada com sucesso');
        } catch (error) {
            console.error(error);
        } finally {
            setIsDeleteLoading(false);
        }
    };
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Card className="min-w-full">
                    <CardContent className="p-5 py-0 flex justify-between">
                        <div className="flex flex-col gap-2 py-5">
                            <Badge
                                variant={
                                    isBookingConfirmed ? 'default' : 'secondary'
                                }
                                className="w-fit"
                            >
                                {isBookingConfirmed
                                    ? 'Confirmado'
                                    : 'Finalizado'}
                            </Badge>
                            <h2 className="font-bold">
                                {booking.service.name}
                            </h2>
                            <div className="flex items-center gap-2 ">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage
                                        src={booking.barbershop.imageUrl}
                                    />
                                    <AvatarFallback>A</AvatarFallback>
                                </Avatar>
                                <h3 className="text-sm">
                                    {booking.barbershop.name}
                                </h3>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center border-l border-solid border-secondary pl-5">
                            <p className="text-sm">
                                {format(booking.date, 'MMMM', {
                                    locale: ptBR
                                })}
                            </p>
                            <p className="text-2xl">
                                {format(booking.date, 'dd')}
                            </p>
                            <p className="text-sm">
                                {format(booking.date, 'HH:mm')}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </SheetTrigger>
            <SheetContent className="px-0">
                <SheetHeader className="px-5 text-left pb-6 border-b border-solid border-secondary">
                    <SheetTitle>Informações da reserva</SheetTitle>
                </SheetHeader>

                <div className="px-5 mt-6">
                    <div className="relative h-[180px] w-full">
                        <Image
                            src="/barbershop-map.png"
                            fill
                            alt={booking.barbershop.name}
                        />
                        <div className="w-full absolute bottom-4 left-0 px-5">
                            <Card>
                                <CardContent className="p-3 flex gap-2">
                                    <Avatar>
                                        <AvatarImage
                                            src={booking.barbershop.imageUrl}
                                        />
                                    </Avatar>
                                    <div>
                                        <h2 className="font-bold">
                                            {booking.barbershop.name}
                                        </h2>
                                        <h3 className="text-xs overflow-hidden text-nowrap text-ellipsis">
                                            {booking.barbershop.address}
                                        </h3>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    <Badge
                        variant={isBookingConfirmed ? 'default' : 'secondary'}
                        className="w-fit mt-6 mb-3"
                    >
                        {isBookingConfirmed ? 'Confirmado' : 'Finalizado'}
                    </Badge>

                    <BookingInfo booking={booking} />

                    <SheetFooter className="flex-row gap-3 mt-6">
                        <SheetClose asChild>
                            <Button variant="secondary" className="w-full">
                                Voltar
                            </Button>
                        </SheetClose>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    disabled={
                                        !isBookingConfirmed || isDeleteLoading
                                    }
                                    variant="destructive"
                                    className="w-full"
                                >
                                    Cancelar Reserva
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="w-[90%]">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Cancelar Reserva
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Tem certeza que deseja cancelar esse
                                        agendamento?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="flex-row gap-3">
                                    <AlertDialogCancel className="w-full mt-0">
                                        Voltar
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        disabled={isDeleteLoading}
                                        className="w-full"
                                        onClick={handleCancelClick}
                                    >
                                        {isDeleteLoading && (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        Confirmar
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </SheetFooter>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default BookingItem;
