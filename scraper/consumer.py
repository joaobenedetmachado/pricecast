import pika
from utils import grab_elements_by_directive

def callback(ch, method, properties, body):
    mensagem = body.decode()
    data = grab_elements_by_directive(mensagem)
    print(data)
    # salvar no csv ou algo assim

connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()

channel.queue_declare(queue='scrapers_queue')

channel.basic_consume(queue='scrapers_queue',
                      on_message_callback=callback,
                      auto_ack=True)

print("waiting for body req... (Ctrl+C to quit)")
channel.start_consuming()
