import { Card, CardContent } from '@/app/_components/ui/card';
import { Barbershop, Booking, Prisma, Service } from '@prisma/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BookingInfoProps {
    booking: Partial<Pick<Booking, 'date'>> & {
        service: Pick<Service, 'name' | 'price'>;
        barbershop: Pick<Barbershop, 'name'>;
    };
}
const BookingInfo = ({ booking }: BookingInfoProps) => {
    return (
            <Card>
                <CardContent className="p-3 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold">{booking.service.name}</h2>
                        <h3 className="font-bold text-sm">
                            {Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            }).format(Number(booking.service.price))}
                        </h3>
                    </div>

                    {booking.date && (
                        <>
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm text-gray-400">Data</h3>
                                <h4 className="text-sm">
                                    {format(booking.date, "dd 'de' MMMM", {
                                        locale: ptBR
                                    })}
                                </h4>
                            </div>
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm text-gray-400">
                                    Horário
                                </h3>
                                <h4 className="text-sm">
                                    {format(booking.date, 'HH:mm')}
                                </h4>
                            </div>
                        </>
                    )}

                    <div className="flex justify-between items-center">
                        <h3 className="text-sm text-gray-400">Barbearia</h3>
                        <h4 className="text-sm">{booking.barbershop.name}</h4>
                    </div>
                </CardContent>
            </Card>
    );
};

export default BookingInfo;
