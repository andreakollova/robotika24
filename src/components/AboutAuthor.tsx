export default function AboutAuthor() {
  return (
    <div className="mt-10 border-t-4 border-[#cb1e26] bg-gray-50 rounded-b-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wider mb-4">O autorovi</h3>
      <div className="flex gap-5 items-start">
        <img
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
          alt="Martin Kovac"
          className="w-20 h-20 rounded-full object-cover shrink-0"
        />
        <div>
          <h4 className="text-gray-900 font-bold text-lg mb-1">Martin Kovac</h4>
          <p className="text-gray-600 text-sm leading-relaxed">
            Martin je technologicky novinar so zameranim na robotiku, umelu inteligenciu a automatizaciu.
            Po studiu informatiky na STU v Bratislave pracoval v niekolkych technologickych firmach,
            odkial prinasa prakticky pohlad na najnovsie inovacie. Pre robotika24 pokryva temy od
            priemyselnych robotov az po spotrebitelsku elektroniku a autonomne vozidla.
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Kontakt: martin@robotika24.sk
          </p>
        </div>
      </div>
    </div>
  );
}
