'use client';

export default function List({ list }) {
  
  return (
    <ul className="space-y-2 list-disc list-inside text-gray-100 text-left">
      {list?.map((feature, index) => (
        <li key={index} className="transition-colors">
          {feature}
        </li>
      ))}
    </ul>
  );
}
