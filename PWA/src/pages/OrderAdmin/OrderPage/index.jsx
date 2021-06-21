import React, { useEffect, useState } from 'react';
import { Container, Form } from 'react-bootstrap';
import AdminContainer from '../../../components/AdminContainer';
import ButtonsFormAdmin from '../../../components/ButtonsFormAdmin';
import TableList from '../../../components/TableListAdmin';
import OrderAdminApiService from '../../../services/api/OrderAdminApiService';
import orderStatus from '../../../services/utils/orderStatus';
import './OrderPage.css';

function OrderPage(props) {
  const { match } = props;
  const [order, setOrder] = useState({});
  const [orderProducts, setOrderProducts] = useState([]);
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const th = {
    name: 'Nome',
    quantity: 'Quantidade',
    unitary_value_selled: 'Valor Unitário',
    total_value: 'Valor Total',
  };

  const getOrder = async () => {
    try {
      const resp = await OrderAdminApiService.getById(match.params.id).then(
        (r) => r.data
      );
      if (resp.success) {
        const date = new Date(resp.data.selled_date);
        setOrder({
          ...resp.data,
          selled_date: date.toLocaleDateString(),
        });
      }
      throw new Error(`Unable to get orders: ${resp.error}`);
    } catch (err) {
      console.error(err);
    }
  };

  const getOrderProducts = () => {
    if (order.products !== undefined) {
      const listProducts = order.products.map((p) => {
        console.warn(p);
        return {
          ...p,
          unitary_value_selled: p.unitary_value_selled
            .toFixed(2)
            .toString()
            .replace('.', ','),
          total_value: (p.quantity * p.unitary_value_selled)
            .toFixed(2)
            .toString()
            .replace('.', ','),
        };
      });
      setOrderProducts(listProducts);
    }
  };

  const getStatusOptions = () => {
    const options = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    return options.map((option) => (
      <option value={option}>
        {`${option} - ${orderStatus.convert(option)}`}
      </option>
    ));
  };

  const handleChange = (event) => {
    setOrder({
      ...order,
      [event.target.name]: Number(event.target.value) || event.target.value,
    });
  };

  const handleEdit = () => {
    setIsReadOnly(!isReadOnly);
  };

  const handleSubmit = async () => {
    const form = {
      tracking_code: order.tracking_code,
      status_order: order.status_order,
      send_method: order.send_method,
      shipped_date: order.shipped_date,
      estimated_date: order.estimated_date,
    };
    try {
      setIsSaving(true);
      const resp = await OrderAdminApiService.update(order.id, form).then(
        (r) => r.data
      );
      if (resp.success) {
        handleEdit();
      } else {
        throw new Error(`Unable to update order: ${resp.err}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    getOrder();
  }, []);

  useEffect(() => {
    getOrderProducts();
  }, [order]);

  return (
    <AdminContainer link="vendas">
      <ButtonsFormAdmin
        path="/admin/vendas"
        handleEdit={handleEdit}
        handleSubmit={handleSubmit}
        isReadOnly={isReadOnly}
        isSaving={isSaving}
      />

      <Container className="order-page-admin container">
        <div className="order-page-admin info">
          <Form.Label className="order-page-admin info label">
            Status do Pedido
          </Form.Label>
          <Form.Control
            name="status_order"
            onChange={handleChange}
            className="order-page-admin info control"
            as="select"
            value={order.status_order}
            readOnly={isReadOnly}
          >
            <option value="" hidden>
              Selecione o status do pedido
            </option>
            {getStatusOptions()}
          </Form.Control>

          <Form.Label className="order-page-admin info label">
            Número do Pedido:
          </Form.Label>
          <Form.Control
            className="order-page-admin info control"
            value={`#${order.invoice}`}
            readOnly
            plaintext
          />

          <Form.Label className="order-page-admin info label">
            Cliente:
          </Form.Label>
          <Form.Control
            className="order-page-admin info control"
            value={order.name_user}
            readOnly
            plaintext
          />

          <Form.Label className="order-page-admin info label">
            Data da compra:
          </Form.Label>
          <Form.Control
            className="order-page-admin info control"
            value={order.selled_date}
            readOnly
            plaintext
          />

          <Form.Label className="order-page-admin info label">
            Total de produtos:
          </Form.Label>
          <Form.Control
            className="order-page-admin info control"
            value={order.quantity}
            readOnly
            plaintext
          />

          <Form.Label className="order-page-admin info label">
            Total da venda:
          </Form.Label>
          <Form.Control
            className="order-page-admin info control"
            value={`R$ ${order.value_total}`}
            readOnly
            plaintext
          />

          <Form.Label className="order-page-admin info label">
            Forma de Pagamento:
          </Form.Label>
          <Form.Control
            className="order-page-admin info control"
            value={order.payment_method}
            readOnly
            plaintext
          />

          <Form.Label className="order-page-admin info label">
            Método de envio:
          </Form.Label>
          <Form.Control
            className="order-page-admin info control"
            value={order.send_method}
            name="send_method"
            readOnly={isReadOnly}
            onChange={handleChange}
            as="select"
          >
            <option value="" hidden>
              Selecione um método de envio
            </option>
            <option value="sedex">Sedex</option>
            <option value="pac">PAC</option>
          </Form.Control>

          <Form.Label className="order-page-admin info label">
            Código de Rastreio:
          </Form.Label>
          <Form.Control
            className="order-page-admin info control"
            value={order.tracking_code}
            name="tracking_code"
            readOnly={isReadOnly}
            onChange={handleChange}
          />

          <Form.Label className="order-page-admin info label">
            Data de Envio:
          </Form.Label>
          <Form.Control
            className="order-page-admin info control"
            value={order.shipped_date}
            name="shipped_date"
            readOnly={isReadOnly}
            onChange={handleChange}
          />

          <Form.Label className="order-page-admin info label">
            Data prevista da entrega:
          </Form.Label>
          <Form.Control
            className="order-page-admin info control"
            value={order.estimated_date}
            name="estimated_date"
            readOnly={isReadOnly}
            onChange={handleChange}
          />

          <Form.Label className="order-page-admin info label">
            Entregue em:
          </Form.Label>
          <Form.Control
            className="order-page-admin info control"
            value={order.finished_code}
            name="finished_code"
            readOnly={isReadOnly}
            onChange={handleChange}
          />
        </div>
        <div className="order-page-admin produtos">
          <TableList itens={orderProducts} tableHead={th} />
        </div>
      </Container>
    </AdminContainer>
  );
}

export default OrderPage;
