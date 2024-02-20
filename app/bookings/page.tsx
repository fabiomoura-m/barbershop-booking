import { getServerSession } from 'next-auth';
import Header from '../_components/header';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { db } from '../_lib/prisma';
import BookingItem from '../_components/booking-item';
import { Booking } from '@prisma/client';

const BookingsPage = async () => {
    // recuperar a sessão de usuario (ver se ele está logado)
    const session = await getServerSession(authOptions);

    // se ele não estiver logado, redirecionar para a página de login
    if (!session?.user) {
        return redirect('/');
    }

    const [confirmedBookings, finishedBookings]: [Booking[], Booking[]] =
        await Promise.all([
            db.booking.findMany({
                where: {
                    userId: (session.user as any).id,
                    date: {
                        gte: new Date()
                    }
                },
                include: {
                    service: true,
                    barbershop: true
                }
            }),
            db.booking.findMany({
                where: {
                    userId: (session.user as any).id,
                    date: {
                        lte: new Date()
                    }
                },
                include: {
                    service: true,
                    barbershop: true
                }
            })
        ]);

    return (
        <>
            <Header />
            <div className="px-5 py-6">
                <h1 className="text-xl font-bold">Agendamentos</h1>

                <h2 className="text-gray-400 uppercase font-bold text-sm mt-6 mb-3">
                    Confirmados
                </h2>

                <div className="flex flex-col gap-3">
                    {confirmedBookings.map(booking => (
                        <BookingItem key={booking.id} booking={booking} />
                    ))}
                </div>

                <h2 className="text-gray-400 uppercase font-bold text-sm mt-6 mb-3">
                    Finalizados
                </h2>

                <div className="flex flex-col gap-3">
                    {finishedBookings.map(booking => (
                        <BookingItem key={booking.id} booking={booking} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default BookingsPage;
