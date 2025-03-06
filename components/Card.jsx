import Image from 'next/image';

export default function Card({
  image,
  urut,
  option,
  nim,
  tanggal_lahir,
  visi,
  misi,
}) {
  // Pastikan URL gambar dari Supabase lengkap
  const imageUrl = image?.startsWith('http')
    ? image
    : `https://your-supabase-url/storage/v1/object/public/${image}`;

  return (
    <div className='w-72 md:w-96 h-auto max-h-screen border-t-4 border-yellow-400 shadow-lg rounded-lg p-4 bg-green-300'>
      <div className='flex flex-col justify-center items-center'>
        <div className='w-60 h-60 relative flex'>
          <Image
            src={imageUrl}
            alt={`Foto ${option}`}
            layout='fill' // Pastikan gambar responsif
            objectFit='cover' // Pastikan gambar pas di container
            className='rounded-md'
            style={{ objectPosition: '50% 30%' }}
          />
        </div>
        <div className='text-center'>
          <div className='text-xl font-bold text-green-700'>
            {urut} - {option}
          </div>
          <p className='text-green-900 text-sm'>NIM: {nim}</p>
          <p className='text-green-900 text-sm'>Lahir: {tanggal_lahir}</p>
        </div>
      </div>

      <div className='text-center  text-green-900 mt-4'>
        <h3 className='text-left text-md font-semibold mt-2'>Visi:</h3>
        <p className='text-left text-sm text-green-800'>{visi}</p>
        <h3 className='text-left text-md font-semibold mt-2'>Misi:</h3>
        <div className='text-left text-sm text-green-800'>
          {misi?.match(/\d+\..+?(?=\d+\.|$)/gs)?.map((misiItem, index) => (
            <p key={index}>{misiItem.trim()}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
