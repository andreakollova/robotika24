export default function AboutAuthor() {
  return (
    <div className="mt-10 border-t-4 border-[#cb1e26] bg-gray-50 rounded-b-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wider mb-4">O autorovi</h3>
      <div className="flex gap-5 items-start">
        <img
          src="/author.jpg"
          alt="Martin Kováč"
          className="w-20 h-20 rounded-full object-cover shrink-0"
        />
        <div>
          <h4 className="text-gray-900 font-bold text-lg mb-1">Martin Kováč</h4>
          <p className="text-gray-600 text-sm leading-relaxed">
            Martin je technologický novinár so zameraním na robotiku, umelú inteligenciu a automatizáciu.
            Po štúdiu informatiky na STU v Bratislave pracoval v niekoľkých technologických firmách,
            odkiaľ prináša praktický pohľad na najnovšie inovácie. Pre robotika24 pokrýva témy od
            priemyselných robotov až po spotrebiteľskú elektroniku a autonómne vozidlá.
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Kontakt: martin@robotika24.sk
          </p>
        </div>
      </div>
    </div>
  );
}
