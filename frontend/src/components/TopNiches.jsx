import React from "react";

const TopNiches = () => {
  const services = [
    {
      id: 1,
      service: "Software Devlopment",
      description:
        "lkjdhkjf ksdjfdskjfskj kkndsjkfkjs f kjksndkjfsk  kjk kjd fks k sf sdk fhds fkks dhf dsk fhs ks hsd f dsh ksd fksd fhs s h",
    },
    {
      id: 2,
      service: "Web Devlopment",
      description:
        "lkjdhkjf ksdjfdskjfskj kkndsjkfkjs f kjksndkjfsk  kjk kjd fks k sf sdk fhds fkks dhf dsk fhs ks hsd f dsh ksd fksd fhs s h",
    },
    {
      id: 3,
      service: "Data Science",
      description:
        "lkjdhkjf ksdjfdskjfskj kkndsjkfkjs f kjksndkjfsk  kjk kjd fks k sf sdk fhds fkks dhf dsk fhs ks hsd f dsh ksd fksd fhs s h",
    },
    {
      id: 4,
      service: "Cloud Computing",
      description:
        "lkjdhkjf ksdjfdskjfskj kkndsjkfkjs f kjksndkjfsk  kjk kjd fks k sf sdk fhds fkks dhf dsk fhs ks hsd f dsh ksd fksd fhs s h",
    },
    {
      id: 5,
      service: "DevOps",
      description:
        "lkjdhkjf ksdjfdskjfskj kkndsjkfkjs f kjksndkjfsk  kjk kjd fks k sf sdk fhds fkks dhf dsk fhs ks hsd f dsh ksd fksd fhs s h",
    },
    {
      id: 6,
      service: "Mobile App Devlopment",
      description:
        "lkjdhkjf ksdjfdskjfskj kkndsjkfkjs f kjksndkjfsk  kjk kjd fks k sf sdk fhds fkks dhf dsk fhs ks hsd f dsh ksd fksd fhs s h",
    },
  ];

  return (
    <section className="services">
      <h3>Top Niches</h3>
      <div className="grid">
        {services.map((element) => {
          return (
            <div className="card" key={element.id}>
              <h4>{element.service}</h4>
              <p>{element.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TopNiches;
