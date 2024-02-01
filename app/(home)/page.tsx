import { format } from 'date-fns';
import Header from '../_components/header';
import { ptBR } from 'date-fns/locale';

export default function Home() {
    return (
        <div>
            <Header />

          <div className='px-5 py-6'>
            <h2 className='text-xl font-bold'>Olá, Fabio!</h2>
            <p className="capitalize">
                {format(new Date(), "EEEE',' d 'de' MMMM", { locale: ptBR })}
            </p>
          </div>

          
        </div>
    );
}
