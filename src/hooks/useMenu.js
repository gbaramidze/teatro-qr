import {useEffect, useRef, useState} from "react";

export function useMenu() {
  const [menu, setMenu] = useState(null);
  const [lang, setLang] = useState("ru");
  const [activeCat, setActiveCat] = useState(null);
  const refs = useRef({});

  useEffect(() => {
    fetch("https://teatro.eat-me.online/api/v1/menu")
      .then((res) => res.json())
      .then(s => setMenu(s.result || []));
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY + 100;
      for (const cat of menu?.categories || []) {
        const el = refs.current[cat.id];
        if (el && el.offsetTop <= scrollY) {
          setActiveCat(cat.id);
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [menu]);

  return {menu, lang, setLang, activeCat, setActiveCat, refs};
}
