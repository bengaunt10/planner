# Generated by Django 5.1.6 on 2025-02-22 00:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scheduler', '0005_remove_task_created_alter_task_repeat'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='repeat',
            field=models.CharField(choices=[('none', 'none'), ('daily', 'daily'), ('weekly', 'weekly'), ('duplicate', 'duplicate')], max_length=10),
        ),
    ]
