import React from "react";
const ListGroup = (props) => {
  const { items } = props;
  return (
    <ul className="list-group">
      {items.map((g) => (
        <li key={g._id} className="list-group-item">
          {g.name}
        </li>
      ))}
    </ul>
  );
};

export default ListGroup;
