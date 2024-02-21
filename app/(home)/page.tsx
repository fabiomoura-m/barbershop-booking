import { format } from 'date-fns';
import Header from '../_components/header';
import { ptBR } from 'date-fns/locale';
import Search from './_components/search';
import BookingItem from '../_components/booking-item';
import { db } from '../_lib/prisma';
import BarbershopItem from './_components/barbershop-item';
import { Barbershop, Booking } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';

export default async function Home() {
    const session = await getServerSession(authOptions);
    const barbershops: Barbershop[] = await db.barbershop.findMany({});

    const confirmedBookings: Booking[] = session?.user
        ? await db.booking.findMany({
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
          })
        : [];

    return (
        <div>
            <Header />
            <div className="px-5 pt-6">
                <h2 className="text-xl font-bold">
                    {session?.user
                        ? `Olá, ${session.user.name?.split(' ')[0]}!`
                        : 'Olá, Vamos agendar um corte hoje?'}
                </h2>
                <p className="capitalize">
                    {format(new Date(), "EEEE',' d 'de' MMMM", {
                        locale: ptBR
                    })}
                </p>
            </div>

            <div className="px-5 mt-6">
                <Search />
            </div>

            {confirmedBookings.length !== 0 && (
                <div className="px-5 mt-6">
                    <h2 className="text-xs uppercase text-gray-400 font-bold mb-3">
                        Agendamentos
                    </h2>
                    <div className="flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                        {confirmedBookings.map(booking => (
                            <BookingItem booking={booking} key={booking.id} />
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-6">
                <h2 className="px-5 text-xs uppercase text-gray-400 font-bold mb-3">
                    Recomendados
                </h2>

                <div className="flex gap-4 px-5 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                    {barbershops.map(barbershop => (
                        <BarbershopItem
                            barbershop={barbershop}
                            key={barbershop.id}
                        />
                    ))}
                </div>
            </div>

            <div className="mt-6 mb-12">
                <h2 className="px-5 text-xs uppercase text-gray-400 font-bold mb-3">
                    Populares
                </h2>

                <div className="flex gap-4 px-5 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                    {barbershops.map(barbershop => (
                        <BarbershopItem
                            barbershop={barbershop}
                            key={barbershop.id}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
