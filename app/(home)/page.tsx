import { format } from 'date-fns';
import Header from '../_components/header';
import { ptBR } from 'date-fns/locale';
import Search from './_components/search';
import BookingItem from '../_components/booking-item';
import { db } from '../_lib/prisma';
import BarbershopItem from './_components/barbershop-item';
import { Barbershop } from '@prisma/client';

export default async function Home() {
    //chamar prisma e pegar barbearias
    const barbershops: Barbershop[] = await db.barbershop.findMany({});

    return (
        <div>
            <Header />
            <div className="px-5 pt-6">
                <h2 className="text-xl font-bold">Olá, Fabio!</h2>
                <p className="capitalize">
                    {format(new Date(), "EEEE',' d 'de' MMMM", {
                        locale: ptBR
                    })}
                </p>
            </div>

            <div className="px-5 mt-6">
                <Search />
            </div>

            <div className="px-5 mt-6">
                <h2 className="text-xs uppercase text-gray-400 font-bold mb-3">
                    Agendamentos
                </h2>
                {/* <BookingItem /> */}
            </div>

            <div className="mt-6">
                <h2 className="px-5 text-xs uppercase text-gray-400 font-bold mb-3">
                    Recomendados
                </h2>

                <div className='flex gap-4 px-5 overflow-x-auto [&::-webkit-scrollbar]:hidden'>
                    {barbershops.map((barbershop) => (
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

                <div className='flex gap-4 px-5 overflow-x-auto [&::-webkit-scrollbar]:hidden'>
                    {barbershops.map((barbershop) => (
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
